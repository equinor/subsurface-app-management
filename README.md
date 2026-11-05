
<img alt="intro-logo" src="https://raw.githubusercontent.com/equinor/amplify-components/main/static/amplify_logo.png" width="300px" />

This package contains components, utils, providers and hooks that are used to communicate with `equinor/SubsurfAppManagement` developed by the amplify team.


# Quick links
- [Storybook](https://subsurface-management-storybook.app.radix.equinor.com/)

# Building and publishing 

Build and publish is done automatically when code is merged into `main` branch, if the package.json version number is higher.

# Latest version
[![main](https://img.shields.io/npm/v/@equinor/subsurface-app-management?color=%23c3f3d2&label=%40equinor%2Fsubsurface-app-management&logo=npm&)](https://www.npmjs.com/package/@equinor/subsurface-app-management)

# Proxying Application Insights through nginx

Ad blockers block requests to `*.in.applicationinsights.azure.com`, so `ApplicationInsightsProvider` sends telemetry to the
same-origin path `/ai/v2/track` and nginx forwards it to Azure. Tracking is optional: without
`APPLICATION_INSIGHTS_CONNECTION_STRING` the app tracks nothing and nginx doesn't expose the proxy path. The ingestion
host is read from the `IngestionEndpoint` in the connection string, falling back to the Application Insights default
(`dc.services.visualstudio.com`) when it has none, so no separate host variable is needed.

Copy the files below into your app repo, replacing the existing ones (examples are taken from `equinor/sam-frontend`, so
keep any app-specific parts of yours, such as the port, runtime variables and build steps). Lines related to Application
Insights are marked in the notes above each file.

## 1. Create `proxy/ai-proxy.conf.template`

```nginx
location = /ai/v2/track {
    limit_req zone=ai burst=20 nodelay;
    limit_req_status 429;
    client_max_body_size 1m;

    proxy_pass https://${APPLICATION_INSIGHTS_INGESTION_HOST}/v2/track;
    proxy_ssl_server_name on;
    proxy_ssl_verify on;
    proxy_ssl_verify_depth 3;
    proxy_ssl_trusted_certificate /etc/ssl/certs/ca-certificates.crt;
    proxy_set_header Host ${APPLICATION_INSIGHTS_INGESTION_HOST};
    proxy_set_header X-Forwarded-For $remote_addr;
}
```

## 2. Replace `proxy/nginx.conf`

Replace the file with the one below. Changes vs. a standard setup: the `limit_req_zone` line and the
`include /etc/nginx/ai-proxy.conf;` line. Adjust `listen`, the `/api/` proxy and other app-specific parts if yours differ.

```nginx
limit_req_zone $binary_remote_addr zone=ai:10m rate=5r/s;

server {
    listen       5001;
    server_name  localhost;

    root   /usr/share/nginx/html;

    include /etc/nginx/conf.d/securityheaders.conf;

    # Application Insights proxy (empty file when APPLICATION_INSIGHTS_CONNECTION_STRING isn't set)
    include /etc/nginx/ai-proxy.conf;

    location /api/ {
        client_max_body_size 100M;
        proxy_pass ${API_URL};
    }

    location / {
        index  index.html index.htm;
        try_files $uri /index.html;
    }

    location /env-config.js {
        add_header Cache-Control "no-cache";
        proxy_cache_bypass $http_pragma;
        proxy_cache_revalidate on;
        expires off;
        access_log off;
    }

    location /env.sh {
        deny all;
    }

    location ~ \.html$ {
        add_header Cache-Control "no-cache";
        proxy_cache_bypass $http_pragma;
        proxy_cache_revalidate on;
        expires off;
        access_log off;

        include /etc/nginx/conf.d/securityheaders.conf;
    }
}
```

> `ai-proxy.conf` must live in `/etc/nginx/`, not `/etc/nginx/conf.d/`. nginx auto-includes everything in `conf.d/*.conf`
> in the `http` context, where `location` is invalid, and fails to start.

## 3. Replace `env.sh`

Replace the file with the one below. Changes vs. a standard setup: the `if` block at the bottom. Keep your own
`value=...` lines (one per runtime variable, matching `radixconfig.yaml`) if they differ.

```sh
#!/bin/sh

# Add assignment
echo "window._env_ = {" >>./env-config.js

# For all the environment variables we want to have at
# runtime (one to one with Radixconfig)

value=$(printf '%s\n' "${CLIENT_ID}")
echo "  CLIENT_ID: \"$value\"," >>./env-config.js

value=$(printf '%s\n' "${API_CLIENT_ID}")
echo "  API_CLIENT_ID: \"$value\"," >>./env-config.js

value=$(printf '%s\n' "${NAME}")
echo "  NAME: \"$value\"," >>./env-config.js

value=$(printf '%s\n' "${API_URL}")
echo "  API_URL: \"$value\"," >>./env-config.js

value=$(printf '%s\n' "${API_SCOPE}")
echo "  API_SCOPE: \"$value\"," >>./env-config.js

value=$(printf '%s\n' "${ENVIRONMENT_NAME}")
echo "  ENVIRONMENT_NAME: \"$value\"," >>./env-config.js

value=$(printf '%s\n' "${APPLICATION_INSIGHTS_CONNECTION_STRING}")
echo "  APPLICATION_INSIGHTS_CONNECTION_STRING: \"$value\"," >>./env-config.js

echo "}" >>./env-config.js

# Application Insights proxy (optional): only render the location when a connection string is set.
# The host comes from its IngestionEndpoint, falling back to the Application Insights default.
if [ -n "${APPLICATION_INSIGHTS_CONNECTION_STRING}" ]; then
  APPLICATION_INSIGHTS_INGESTION_HOST=$(printf '%s' "${APPLICATION_INSIGHTS_CONNECTION_STRING}" | tr ';' '\n' | sed -n 's/^IngestionEndpoint=https\{0,1\}:\/\/\([^/]*\).*/\1/p' | head -n 1)
  export APPLICATION_INSIGHTS_INGESTION_HOST="${APPLICATION_INSIGHTS_INGESTION_HOST:-dc.services.visualstudio.com}"
  envsubst '${APPLICATION_INSIGHTS_INGESTION_HOST}' </etc/nginx/ai-proxy.conf.template >/etc/nginx/ai-proxy.conf
else
  : >/etc/nginx/ai-proxy.conf
fi

# Update nginx.conf and securityheaders.conf with relevant environment variables
envsubst '${API_URL}' </etc/nginx/conf.d/default.conf.template >/etc/nginx/conf.d/default.conf
envsubst '${API_URL}' </etc/nginx/conf.d/securityheaders.conf.template >/etc/nginx/conf.d/securityheaders.conf
```

## 4. Replace the `Dockerfile`

Replace the file with the one below. Changes vs. a standard setup: the `ai-proxy.conf.template` `COPY` and the two
`ai-proxy.conf` lines in the `RUN`. Adjust the build stage and `EXPOSE` port to your app.

```dockerfile
# Base
FROM imbios/bun-node:22-alpine AS base
WORKDIR /app
COPY package.json ./
COPY bun.lock ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY src ./src
COPY public ./public

# Install dependencies and build
RUN bun install --frozen-lockfile && bun run build

# STAGE 2 => SETUP NGINX and Run
FROM nginxinc/nginx-unprivileged:alpine
USER 0
# Clear default nginx html file
RUN rm -rf /usr/share/nginx/html/*
COPY --from=base /app/dist /usr/share/nginx/html
COPY proxy/nginx.conf /etc/nginx/conf.d/default.conf.template
COPY proxy/securityheaders.conf /etc/nginx/conf.d/securityheaders.conf.template
COPY proxy/ai-proxy.conf.template /etc/nginx/ai-proxy.conf.template

EXPOSE 5001

# Copy shell script to container to handle runtime environment variables
WORKDIR /usr/share/nginx/html
COPY ./env.sh .

RUN rm -rf ./env-config.js \
  && touch ./env-config.js \
  && touch /etc/nginx/ai-proxy.conf \
  && chown nginx ./env-config.js /etc/nginx/ai-proxy.conf \
  && chown -R nginx /etc/nginx/conf.d \
  && chown -R nginx /usr/share/nginx/html \
  && chmod +x ./env.sh

USER 101

CMD ["/bin/sh", "-c", "./env.sh && nginx -g \"daemon off;\""]
```

## 5. Update `radixconfig.yaml`

For each environment that should track, set the connection string. The proxy target is taken from its
`IngestionEndpoint` automatically (or the Application Insights default if it has none). For environments without
tracking, set it to `''` or leave it out.

```yaml
APPLICATION_INSIGHTS_CONNECTION_STRING: 'InstrumentationKey=...;IngestionEndpoint=https://northeurope-4.in.applicationinsights.azure.com/;...'
```

## 6. Verify

```sh
docker build -t app .
docker run --rm -d --name app-test -p 5001:5001 -e APPLICATION_INSIGHTS_CONNECTION_STRING='InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://northeurope-4.in.applicationinsights.azure.com/' app
curl -i -X POST http://localhost:5001/ai/v2/track -d '[]'   # reaches Azure (200/400), not 404/502
docker stop app-test

# No connection string set: nginx still starts without the proxy path
docker run --rm -d --name app-test -p 5001:5001 app
docker logs app-test
docker stop app-test
```

Replace `5001` with the port your `nginx.conf` listens on, and add the app's other required variables (`NAME`, `ENVIRONMENT_NAME`, `API_URL`, ...) if needed.

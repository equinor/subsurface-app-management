
<img alt="intro-logo" src="https://raw.githubusercontent.com/equinor/amplify-components/main/static/amplify_logo.png" width="300px" />

This package contains components, utils, providers and hooks that are used to communicate with `equinor/SubsurfAppManagement` developed by the amplify team.


# Quick links
- [Storybook](https://subsurface-management-storybook.app.radix.equinor.com/)

# Building and publishing 

Build and publish is done automatically when code is merged into `main` branch, if the package.json version number is higher.

# Latest version
[![main](https://img.shields.io/npm/v/@equinor/subsurface-app-management?color=%23c3f3d2&label=%40equinor%2Fsubsurface-app-management&logo=npm&)](https://www.npmjs.com/package/@equinor/subsurface-app-management)

# Proxying Application Insights through nginx

Ad blockers block requests to `*.in.applicationinsights.azure.com`. `ApplicationInsightsProvider` always sends telemetry to the same-origin path `/ai/v2/track` instead, and nginx
forwards it to the real ingestion endpoint.

## 1. Radix config (`radixconfig.yaml`)

The ingestion host differs between environments (it is the `IngestionEndpoint` in the connection string),
so pass it to nginx as an env variable.

```yaml
environmentConfig:
  - environment: development
    variables:
      APPLICATION_INSIGHTS_CONNECTION_STRING: 'InstrumentationKey=...;IngestionEndpoint=https://northeurope-2.in.applicationinsights.azure.com/;...'
      APPLICATION_INSIGHTS_INGESTION_HOST: 'northeurope-2.in.applicationinsights.azure.com'

  - environment: staging
    variables:
      APPLICATION_INSIGHTS_CONNECTION_STRING: 'InstrumentationKey=...;IngestionEndpoint=https://northeurope-4.in.applicationinsights.azure.com/;...'
      APPLICATION_INSIGHTS_INGESTION_HOST: 'northeurope-4.in.applicationinsights.azure.com'

  - environment: production
    variables:
      APPLICATION_INSIGHTS_CONNECTION_STRING: 'InstrumentationKey=...;IngestionEndpoint=https://northeurope-4.in.applicationinsights.azure.com/;...'
      APPLICATION_INSIGHTS_INGESTION_HOST: 'northeurope-4.in.applicationinsights.azure.com'
```

## 2. nginx config

Add to the nginx template (`nginx.conf`). `${APPLICATION_INSIGHTS_INGESTION_HOST}` is substituted by
`envsubst` at container start (see step 3). nginx's own variables (`$remote_addr` etc.) are left alone because
`envsubst` only replaces the variables it is explicitly given.

```nginx
# Outside `server {}` (the template is included in the http context)
limit_req_zone $binary_remote_addr zone=ai:10m rate=5r/s;

server {
    # ...existing config...

    location = /ai/v2/track {
        limit_req zone=ai burst=20 nodelay;
        limit_req_status 429;
        client_max_body_size 1m;

        proxy_pass https://${APPLICATION_INSIGHTS_INGESTION_HOST}/v2/track;
        proxy_ssl_server_name on;
        proxy_set_header Host ${APPLICATION_INSIGHTS_INGESTION_HOST};
        proxy_set_header X-Forwarded-For $remote_addr;
    }
}
```

## 3. Container startup script (`env.sh`)

The startup script runs `envsubst` on the nginx templates.
One change is needed:

```sh
# Let envsubst fill in the ingestion host. Variables not listed here are left untouched.
envsubst '${API_URL} ${APPLICATION_INSIGHTS_INGESTION_HOST}' </etc/nginx/conf.d/default.conf.template >/etc/nginx/conf.d/default.conf
envsubst '${API_URL}' </etc/nginx/conf.d/securityheaders.conf.template >/etc/nginx/conf.d/securityheaders.conf
```

`APPLICATION_INSIGHTS_INGESTION_HOST` is only used by nginx, so it does not need to be written to `env-config.js`.
If it is missing from the `envsubst` list, nginx receives the literal `${APPLICATION_INSIGHTS_INGESTION_HOST}` and
fails to start.

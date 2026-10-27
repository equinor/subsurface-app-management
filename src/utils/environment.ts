import { EnvironmentType } from 'src/types/Environment';

interface EnvVariables {
  NAME: string;
  ENVIRONMENT_NAME: string;
  API_URL: string;
  APPLICATION_INSIGHTS_CONNECTION_STRING?: string;
  SAM_API_URL?: string;
}

const OPTIONAL_ENV_VARIABLES: (keyof EnvVariables)[] = [
  'APPLICATION_INSIGHTS_CONNECTION_STRING',
  'SAM_API_URL',
] as const;

const DEFAULT_SAM_API_URL =
  'https://api-sam-backend-{environment}.radix.equinor.com';

declare const window: { _env_: EnvVariables | undefined } & Window;

const getConfig = <T extends keyof EnvVariables>(param: T) => {
  if (!window._env_) {
    return '';
  }
  if (
    window._env_[param] === undefined &&
    !OPTIONAL_ENV_VARIABLES.includes(param)
  ) {
    throw new Error('Missing required environment variable: ' + param);
  }
  return window._env_[param];
};

const getAppName = (appName: string | undefined): string => {
  if (!appName) {
    return getConfig('NAME');
  }
  return appName;
};

const getEnvironmentName = (
  environmentName: string | EnvironmentType | undefined
): EnvironmentType => {
  if (!environmentName) {
    return getConfig('ENVIRONMENT_NAME') as EnvironmentType;
  }
  return environmentName as EnvironmentType;
};

const getApiUrl = (apiUrl: string | undefined): string => {
  if (!apiUrl) {
    return getConfig('API_URL');
  }
  return apiUrl;
};

/**
 * Resolves the SAM API base URL for the given SAM environment.
 * Defaults to the Radix URL; override with `VITE_SAM_API_URL` or runtime `SAM_API_URL`,
 * e.g. `/sam-api/{environment}` for a dev-server proxy or `http://localhost:5000` for a local SAM backend.
 */
const getSamApiUrl = (
  samApiUrl: string | undefined,
  samEnvironment: string
): string =>
  (samApiUrl || getConfig('SAM_API_URL') || DEFAULT_SAM_API_URL).replace(
    '{environment}',
    samEnvironment
  );

const getApplicationInsightsConnectionString = (
  instrumentationKey: string | undefined
): string | undefined => {
  if (!instrumentationKey) {
    return getConfig('APPLICATION_INSIGHTS_CONNECTION_STRING');
  }
  return instrumentationKey;
};

export {
  getApplicationInsightsConnectionString,
  getConfig,
  getAppName,
  getEnvironmentName,
  getApiUrl,
  getSamApiUrl,
};

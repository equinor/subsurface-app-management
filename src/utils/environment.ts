import { EnvironmentType } from 'src/types/Environment';

interface EnvVariables {
  NAME: string;
  ENVIRONMENT_NAME: string;
  API_URL: string;
  APPLICATION_INSIGHTS_CONNECTION_STRING?: string;
}

const OPTIONAL_ENV_VARIABLES: (keyof EnvVariables)[] = [
  'APPLICATION_INSIGHTS_CONNECTION_STRING',
] as const;

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
};

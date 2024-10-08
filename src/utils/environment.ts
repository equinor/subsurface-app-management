import { EnvironmentType } from 'src/types/Environment';

interface EnvVariables {
  NAME: string;
  ENVIRONMENT_NAME: string;
  API_URL: string;
}

declare const window: { _env_: EnvVariables | undefined } & Window;

const getConfig = (param: keyof EnvVariables) => {
  if (!window._env_) {
    return '';
  }
  if (window._env_[param] === undefined) {
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

export { getConfig, getAppName, getEnvironmentName, getApiUrl };

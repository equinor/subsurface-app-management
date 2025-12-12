/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiRequestOptions } from './ApiRequestOptions';
import { environment } from 'src/utils';
import { CancelablePromise } from 'src/api';
import { request as __request } from 'src/api/core/request';
import { getLocalStorage, updateLocalStorage } from 'src/utils/localStorage';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { EnvironmentType, PointToProdFeaturesLocalStorageKey } from 'src/types';
import { ENVIRONMENT_TOGGLE_KEY } from 'src/constants';

const { getEnvironmentName, getApiUrl } = environment;

type Resolver<T> = (options: ApiRequestOptions) => Promise<T>;
type Headers = Record<string, string>;

const environmentName = getEnvironmentName(
  import.meta.env.VITE_ENVIRONMENT_NAME
);
const noLocalhostEnvironmentName =
  environmentName === 'localhost' ? 'development' : environmentName;

export type OpenAPIConfig = {
  BASE: string;
  VERSION: string;
  WITH_CREDENTIALS: boolean;
  CREDENTIALS: 'include' | 'omit' | 'same-origin';
  TOKEN?: string | Resolver<string>;
  USERNAME?: string | Resolver<string>;
  PASSWORD?: string | Resolver<string>;
  HEADERS?: Headers | Resolver<Headers>;
  ENCODE_PATH?: (path: string) => string;
};

export class TokenService {
  /**
   * @returns string Success
   * @throws ApiError
   */
  public static getSamPortalToken(): CancelablePromise<string> {
    return __request(OpenAPI_APP, {
      method: 'GET',
      url: '/api/v1/Token/SamPortal',
    });
  }

  /**
   * @returns string Success
   * @throws ApiError
   */
  public static getSamPortalProductionToken(): CancelablePromise<string> {
    return __request(OpenAPI_APP, {
      method: 'GET',
      url: '/api/v1/Token/SamPortal/Production',
    });
  }
}

const isJwtTokenExpired = (token: string) => {
  const decodedToken: JwtPayload = jwtDecode(token);
  const todayInSecUnix = new Date().getTime() / 1000;
  return decodedToken.exp && todayInSecUnix > decodedToken.exp;
};

const isJwtTokenValid = (token: string) => {
  if (token.length === 0) return false;
  try {
    return !isJwtTokenExpired(token);
  } catch (err) {
    return false;
  }
};

const getToken = async (
  localStorageKey: string,
  tokenRequest: () => CancelablePromise<string>
): Promise<string> => {
  const localStorageToken = getLocalStorage(localStorageKey, '');
  if (isJwtTokenValid(localStorageToken)) return localStorageToken;

  const requestToken = await tokenRequest();
  updateLocalStorage(localStorageKey, requestToken);

  return requestToken;
};

export const getSAMToken = async (): Promise<string> => {
  return getToken(`sam-${environmentName}`, TokenService.getSamPortalToken);
};

const getSAMProdToken = async () => {
  return getToken(`sam-production`, TokenService.getSamPortalProductionToken);
};

export const OpenAPI_APP: OpenAPIConfig = {
  BASE: getApiUrl(import.meta.env.VITE_API_URL),
  VERSION: '1.0',
  WITH_CREDENTIALS: false,
  CREDENTIALS: 'include',
  TOKEN: undefined,
  USERNAME: undefined,
  PASSWORD: undefined,
  HEADERS: undefined,
  ENCODE_PATH: undefined,
};

export const OpenAPI_SAM: OpenAPIConfig = {
  BASE: `https://api-sam-backend-${noLocalhostEnvironmentName}.radix.equinor.com`,
  VERSION: '1.0',
  WITH_CREDENTIALS: false,
  CREDENTIALS: 'include',
  TOKEN: getSAMToken,
  USERNAME: undefined,
  PASSWORD: undefined,
  HEADERS: undefined,
  ENCODE_PATH: undefined,
};

interface CustomEnvironment {
  environment: EnvironmentType;
  token?: Resolver<string>;
}

export function getCustomEnvironmentConfig(
  feature: PointToProdFeaturesLocalStorageKey
): CustomEnvironment {
  const environment = getFeatureEnvironment(feature);

  if (environment === EnvironmentType.LOCALHOST) {
    return {
      environment: EnvironmentType.DEVELOP,
      token: getSAMToken,
    };
  }

  if (!environment || environment === EnvironmentType.PRODUCTION) {
    return {
      environment: EnvironmentType.PRODUCTION,
      token: getSAMProdToken,
    };
  }

  return {
    environment: environment,
    token: getSAMToken,
  };
}

/**
 * Determines the environment type for a given feature based on the localStorage configuration.
 *
 * This function checks the `ENVIRONMENT_TOGGLE_KEY` in localStorage to determine if a specific
 * feature or any feature is enabled. If the feature is enabled, it returns the current environment
 * name; otherwise, it returns `null`.
 *
 * @param {PointToProdFeaturesLocalStorageKey} [feature] - The feature key to check in the localStorage.
 * If not provided, the function checks if any feature is enabled.
 *
 * @returns {EnvironmentType | null} - The environment type for the feature if enabled, or `null` if
 * the feature is not enabled or the localStorage value is invalid.
 */
export const getFeatureEnvironment = (
  feature: PointToProdFeaturesLocalStorageKey
): EnvironmentType | null => {
  const environmentToggleValue = localStorage.getItem(ENVIRONMENT_TOGGLE_KEY);

  if (!environmentToggleValue) return null;

  try {
    const enabledFeatures = JSON.parse(environmentToggleValue) as Array<{
      value: string;
      label: string;
    }>;

    const isEnabledFeature = enabledFeatures.some((f) => f.value === feature);
    return isEnabledFeature
      ? getEnvironmentName(import.meta.env.VITE_ENVIRONMENT_NAME)
      : null;
  } catch (error) {
    console.error(
      'Failed to parse environment toggle value from localStorage:',
      error
    );
    return null;
  }
};

export const getOpenAPIConfig = (
  feature: PointToProdFeaturesLocalStorageKey
): OpenAPIConfig => {
  const config = getCustomEnvironmentConfig(feature);

  return {
    BASE: `https://api-sam-backend-${config.environment}.radix.equinor.com`,
    VERSION: '1.0',
    WITH_CREDENTIALS: false,
    CREDENTIALS: 'include',
    TOKEN: config.token,
    USERNAME: undefined,
    PASSWORD: undefined,
    HEADERS: undefined,
    ENCODE_PATH: undefined,
  };
};

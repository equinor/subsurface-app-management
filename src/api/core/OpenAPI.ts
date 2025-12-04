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
  //feature: string;
  environment: string;
  token?: Resolver<string>;
}

function getCustomEnvironmentConfig(
  feature: PointToProdFeaturesLocalStorageKey
): CustomEnvironment {
  const environment = getFeatureEnvironment(feature);

  if (environment === EnvironmentType.LOCALHOST) {
    return {
      environment: 'development',
      token: getSAMToken,
    };
  }

  if (!environment || environment === EnvironmentType.PRODUCTION) {
    return {
      environment: 'production',
      token: getSAMProdToken,
    };
  }

  return {
    environment: environment,
    token: getSAMToken,
  };
}

const getFeatureEnvironment = (
  feature?: PointToProdFeaturesLocalStorageKey
): EnvironmentType | null => {
  if (feature) {
    return localStorage.getItem(feature) === 'true'
      ? getEnvironmentName(import.meta.env.VITE_ENVIRONMENT_NAME)
      : null;
  }

  const features = Object.values(PointToProdFeaturesLocalStorageKey);
  const hasEnabledFeature = features.find((feature) => {
    console.log('feature: ', feature);
    console.log(localStorage.getItem(feature));
    console.log(localStorage.getItem(feature) === 'true');
    return localStorage.getItem(feature) === 'true';
  });
  if (hasEnabledFeature) {
    return getEnvironmentName(import.meta.env.VITE_ENVIRONMENT_NAME);
  }

  return null;
};

const featureToggleConfig = getCustomEnvironmentConfig(
  PointToProdFeaturesLocalStorageKey.FEATURE_TOGGLE
);

export const OpenAPI_SAM_FeatureToggle: OpenAPIConfig = {
  BASE: `https://api-sam-backend-${featureToggleConfig.environment}.radix.equinor.com`,
  VERSION: '1.0',
  WITH_CREDENTIALS: false,
  CREDENTIALS: 'include',
  TOKEN: featureToggleConfig.token,
  USERNAME: undefined,
  PASSWORD: undefined,
  HEADERS: undefined,
  ENCODE_PATH: undefined,
};

console.table(OpenAPI_SAM_FeatureToggle);

const tutorialConfig = getCustomEnvironmentConfig(
  PointToProdFeaturesLocalStorageKey.TUTORIAL
);

export const OpenAPI_SAM_Tutorial: OpenAPIConfig = {
  BASE: `https://api-sam-backend-${tutorialConfig.environment}.radix.equinor.com`,
  VERSION: '1.0',
  WITH_CREDENTIALS: false,
  CREDENTIALS: 'include',
  TOKEN: tutorialConfig.token,
  USERNAME: undefined,
  PASSWORD: undefined,
  HEADERS: undefined,
  ENCODE_PATH: undefined,
};

const impersonateUserConfig = getCustomEnvironmentConfig(
  PointToProdFeaturesLocalStorageKey.IMPERSONATE_USER
);

export const OpenAPI_SAM_ImpersonateUser: OpenAPIConfig = {
  BASE: `https://api-sam-backend-${impersonateUserConfig.environment}.radix.equinor.com`,
  VERSION: '1.0',
  WITH_CREDENTIALS: false,
  CREDENTIALS: 'include',
  TOKEN: impersonateUserConfig.token,
  USERNAME: undefined,
  PASSWORD: undefined,
  HEADERS: undefined,
  ENCODE_PATH: undefined,
};

const faqConfig = getCustomEnvironmentConfig(
  PointToProdFeaturesLocalStorageKey.FAQ
);

export const OpenAPI_SAM_Faq: OpenAPIConfig = {
  BASE: `https://api-sam-backend-${faqConfig.environment}.radix.equinor.com`,
  VERSION: '1.0',
  WITH_CREDENTIALS: false,
  CREDENTIALS: 'include',
  TOKEN: faqConfig.token,
  USERNAME: undefined,
  PASSWORD: undefined,
  HEADERS: undefined,
  ENCODE_PATH: undefined,
};

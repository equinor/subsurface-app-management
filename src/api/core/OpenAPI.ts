/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiRequestOptions } from './ApiRequestOptions';
import { environment } from 'src/utils';
import { CancelablePromise } from 'src/api';
import { request as __request } from 'src/api/core/request';
import { getLocalStorage, updateLocalStorage } from 'src/utils/localStorage';
import { JwtPayload, jwtDecode } from 'jwt-decode';

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
  public static getAmplifyPortalToken(): CancelablePromise<string> {
    return __request(OpenAPI_APP, {
      method: 'GET',
      url: '/api/v1/Token/AmplifyPortal',
    });
  }

  /**
   * @returns string Success
   * @throws ApiError
   */
  public static getAmplifyPortalProductionToken(): CancelablePromise<string> {
    return __request(OpenAPI_APP, {
      method: 'GET',
      url: '/api/v1/Token/AmplifyPortal/Production',
    });
  }

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

export const getJSEmbarkToken = async (): Promise<string> => {
  return getToken(
    `amplify-portal-${environmentName}`,
    TokenService.getAmplifyPortalToken
  );
};

const getJSEmbarkProdToken = async () => {
  return getToken(
    `amplify-portal-production`,
    TokenService.getAmplifyPortalProductionToken
  );
};

export const getSAMToken = async (): Promise<string> => {
  return getToken(`sam-${environmentName}`, TokenService.getSamPortalToken);
};

const getSAMProdToken = async () => {
  return getToken(
    `sam-production`,
    TokenService.getAmplifyPortalProductionToken
  );
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

export const OpenAPI_JSEMBARK: OpenAPIConfig = {
  BASE: `https://api-amplify-portal-${noLocalhostEnvironmentName}.radix.equinor.com`,
  VERSION: '1.0',
  WITH_CREDENTIALS: false,
  CREDENTIALS: 'include',
  TOKEN: getJSEmbarkToken,
  USERNAME: undefined,
  PASSWORD: undefined,
  HEADERS: undefined,
  ENCODE_PATH: undefined,
};

export const OpenAPI_JSEMBARK_Prod: OpenAPIConfig = {
  BASE: `https://api-amplify-portal-production.radix.equinor.com`,
  VERSION: '1.0',
  WITH_CREDENTIALS: false,
  CREDENTIALS: 'include',
  TOKEN: getJSEmbarkProdToken,
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

export const OpenAPI_SAM_Prod: OpenAPIConfig = {
  BASE: `https://api-sam-backend-production.radix.equinor.com`,
  VERSION: '1.0',
  WITH_CREDENTIALS: false,
  CREDENTIALS: 'include',
  TOKEN: getSAMProdToken,
  USERNAME: undefined,
  PASSWORD: undefined,
  HEADERS: undefined,
  ENCODE_PATH: undefined,
};

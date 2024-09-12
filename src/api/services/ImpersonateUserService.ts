/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImpersonateUserDto } from 'src/api/models/ImpersonateUserDto';
import type { ImpersonateUserUpdateDto } from 'src/api/models/ImpersonateUserUpdateDto';
import type { CancelablePromise } from 'src/api';
import { OpenAPI_Portal } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ImpersonateUserService {
  /**
   * Get all impersonate users
   * @returns ImpersonateUser Success
   * @throws ApiError
   */
  public static getApiV1ImpersonateUser(): CancelablePromise<
    Array<ImpersonateUserDto>
  > {
    return __request(OpenAPI_Portal, {
      method: 'GET',
      url: '/api/v1/ImpersonateUser',
      errors: {
        400: `Bad Request`,
        500: `Server Error`,
      },
    });
  }
  /**
   * @param requestBody
   * @returns ImpersonateUser Success
   * @throws ApiError
   */
  public static createImpersonateUser(
    requestBody?: ImpersonateUserUpdateDto
  ): CancelablePromise<ImpersonateUserDto> {
    return __request(OpenAPI_Portal, {
      method: 'POST',
      url: '/api/v1/ImpersonateUser',
      body: requestBody,
      mediaType: 'application/json-patch+json',
      errors: {
        400: `Bad Request`,
        404: `Not Found`,
        500: `Server Error`,
      },
    });
  }
  /**
   * Edits or Creates a impersonate user if it doesnt exist.
   * @param requestBody
   * @returns ImpersonateUser Success
   * @throws ApiError
   */
  public static putImpersonateUser(
    requestBody?: ImpersonateUserDto
  ): CancelablePromise<ImpersonateUserDto> {
    return __request(OpenAPI_Portal, {
      method: 'PUT',
      url: '/api/v1/ImpersonateUser',
      body: requestBody,
      mediaType: 'application/json-patch+json',
      errors: {
        400: `Bad Request`,
      },
    });
  }
  /**
   * Get all impersonate users by application name
   * @param appName
   * @returns ImpersonateUser Success
   * @throws ApiError
   */
  public static getApiV1ImpersonateUserGetImpersonateUserForApp(
    appName: string
  ): CancelablePromise<Array<ImpersonateUserDto>> {
    return __request(OpenAPI_Portal, {
      method: 'GET',
      url: '/api/v1/ImpersonateUser/GetImpersonateUserForApp/{appName}',
      path: {
        appName: appName,
      },
      errors: {
        400: `Bad Request`,
        500: `Server Error`,
      },
    });
  }
  /**
   * Get all active users
   * @returns ImpersonateUser Success
   * @throws ApiError
   */
  public static getAllActiveUsers(): CancelablePromise<ImpersonateUserDto> {
    return __request(OpenAPI_Portal, {
      method: 'GET',
      url: '/api/v1/ImpersonateUser/ActiveUsers',
      errors: {
        400: `Bad Request`,
        500: `Server Error`,
      },
    });
  }
  /**
   * Get active user
   * @returns ImpersonateUser Success
   * @throws ApiError
   */
  public static getActiveUser(): CancelablePromise<ImpersonateUserDto> {
    return __request(OpenAPI_Portal, {
      method: 'GET',
      url: '/api/v1/ImpersonateUser/ActiveUser',
      errors: {
        400: `Bad Request`,
        500: `Server Error`,
      },
    });
  }
  /**
   * Get impersonate user by id
   * @param id
   * @returns ImpersonateUser Success
   * @throws ApiError
   */
  public static getImpersonateUserById(
    id?: string
  ): CancelablePromise<ImpersonateUserDto> {
    return __request(OpenAPI_Portal, {
      method: 'GET',
      url: '/api/v1/ImpersonateUser/ImpersonateUser',
      query: {
        id: id,
      },
      errors: {
        400: `Bad Request`,
        500: `Server Error`,
      },
    });
  }
  /**
   * Get impersonate user by username
   * @param username
   * @returns ImpersonateUser Success
   * @throws ApiError
   */
  public static getImpersonateUserByUserName(
    username?: string
  ): CancelablePromise<ImpersonateUserDto> {
    return __request(OpenAPI_Portal, {
      method: 'GET',
      url: '/api/v1/ImpersonateUser/ImpersonateUserByUserName',
      query: {
        username: username,
      },
      errors: {
        400: `Bad Request`,
        500: `Server Error`,
      },
    });
  }
  /**
   * @returns boolean Success
   * @throws ApiError
   */
  public static canImpersonate(): CancelablePromise<boolean> {
    return __request(OpenAPI_Portal, {
      method: 'GET',
      url: '/api/v1/ImpersonateUser/CanImpersonate',
      errors: {
        400: `Bad Request`,
        404: `Not Found`,
        500: `Server Error`,
      },
    });
  }
  /**
   * @param username
   * @returns ImpersonateUser Success
   * @throws ApiError
   */
  public static startImpersonating(
    username?: string
  ): CancelablePromise<ImpersonateUserDto> {
    return __request(OpenAPI_Portal, {
      method: 'PUT',
      url: '/api/v1/ImpersonateUser/StartImpersonating',
      query: {
        username: username,
      },
      errors: {
        400: `Bad Request`,
        404: `Not Found`,
        500: `Server Error`,
      },
    });
  }
  /**
   * @returns ImpersonateUser Success
   * @throws ApiError
   */
  public static stopImpersonating(): CancelablePromise<ImpersonateUserDto> {
    return __request(OpenAPI_Portal, {
      method: 'PUT',
      url: '/api/v1/ImpersonateUser/StopImpersonating',
      errors: {
        400: `Bad Request`,
        404: `Not Found`,
        500: `Server Error`,
      },
    });
  }
}

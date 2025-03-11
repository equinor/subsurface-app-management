/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Application } from 'src/api/models/Application';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI_SAM_Prod } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { GraphAppRole } from '../models/GraphAppRole';
export class ApplicationService {
  /**
   * Get all applications that user has access to
   * @returns AmplifyApplication Success
   * @throws ApiError
   */
  public static userApplications(): CancelablePromise<Array<Application>> {
    return __request(OpenAPI_SAM_Prod, {
      method: 'GET',
      url: '/api/v1/Application/userapplications',
      errors: {
        400: `Bad Request`,
        500: `Server Error`,
      },
    });
  }
  /**
   * Get all roles for an application
   * @param applicationId
   * @returns GraphAppRole Success
   * @throws ApiError
   */
  public static getAllAppRoles(
    applicationId: string
  ): CancelablePromise<Array<GraphAppRole>> {
    return __request(OpenAPI_SAM_Prod, {
      method: 'GET',
      url: '/api/v1/Application/application/{applicationId}/appRoles',
      path: {
        applicationId: applicationId,
      },
    });
  }
}

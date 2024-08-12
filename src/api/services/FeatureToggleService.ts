/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise, FeatureToggleDto } from 'src/api';
import { OpenAPI_Portal_Prod } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FeatureToggleService {
  /**
   * Gets a Feature Toggle from Application name
   * @param applicationName name
   * @returns FeatureToggleDto Success
   * @throws ApiError
   */
  public static getFeatureToggleFromApplicationName(
    applicationName: string
  ): CancelablePromise<FeatureToggleDto> {
    return __request(OpenAPI_Portal_Prod, {
      method: 'GET',
      url: '/api/v1/FeatureToggle/{applicationName}',
      path: {
        applicationName: applicationName,
      },
      errors: {
        400: `Bad Request`,
        404: `Not Found`,
        500: `Server Error`,
      },
    });
  }
}

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise, MyFeatureDto } from 'src/api';
import { getOpenAPIConfig } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { EnvironmentToggleFeatures } from 'src/types';

export class FeatureToggleService {
  /**
   * Get my features
   * @param applicationName name
   * @param currentEnvironment name
   * @returns MyFeatureDto OK
   * @throws ApiError
   */
  public static getMyFeatures(
    applicationName: string,
    currentEnvironment: string
  ): CancelablePromise<Array<MyFeatureDto>> {
    return __request(
      getOpenAPIConfig(EnvironmentToggleFeatures.FEATURE_TOGGLE),
      {
        method: 'GET',
        url: '/api/v1/FeatureToggle/{applicationName}/{currentEnvironment}/myfeatures',
        path: {
          applicationName: applicationName,
          currentEnvironment: currentEnvironment,
        },
        errors: {
          400: `Bad Request`,
          404: `Not Found`,
          500: `Internal Server Error`,
        },
      }
    );
  }
}

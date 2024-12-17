/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise, MyFeatureDto } from 'src/api';
import { OpenAPI_SAM_Prod } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FeatureToggleService {
  /**
   * Get my features
   * @param applicationName name
   * @returns MyFeatureDto OK
   * @throws ApiError
   */
  public static getMyFeatures(
    applicationName: string
  ): CancelablePromise<Array<MyFeatureDto>> {
    return __request(OpenAPI_SAM_Prod, {
      method: 'GET',
      url: '/api/v1/FeatureToggle/{applicationName}/myfeatures',
      path: {
        applicationName: applicationName,
      },
      errors: {
        400: `Bad Request`,
        404: `Not Found`,
        500: `Internal Server Error`,
      },
    });
  }
}

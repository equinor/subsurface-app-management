/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImpactMetric } from '../models/ImpactMetric';
import type { ImpactMetricDto } from 'src/api';
import type { CancelablePromise } from 'src/api';
import { OpenAPI_SAM } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AppAnalyticsService {
  /**
   * @param applicationName - The name of the application
   * @param requestBody
   * @returns ImpactMetric OK
   * @throws ApiError
   */
  public static postApiV1AppAnalyticsAddImpactMetrics(
    applicationName: string,
    requestBody?: ImpactMetricDto
  ): CancelablePromise<ImpactMetric> {
    return __request(OpenAPI_SAM, {
      method: 'POST',
      url: '/api/v1/AppAnalytics/{applicationName}/impact-metrics',
      path: {
        applicationName,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        404: `Not Found`,
      },
    });
  }
}

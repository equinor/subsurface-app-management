/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BrowseImpactMetric } from '../models/BrowseImpactMetric';
import type { BrowseImpactMetricDto } from '../models/BrowseImpactMetricDto';
import type { CancelablePromise } from 'src/api';
import { OpenAPI_SAM } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AppAnalyticsService {
  /**
   * @param requestBody
   * @returns BrowseImpactMetric OK
   * @throws ApiError
   */
  public static postApiV1AppAnalyticsPwexAddBrowseImpactMetrics(
    requestBody?: BrowseImpactMetricDto
  ): CancelablePromise<BrowseImpactMetric> {
    return __request(OpenAPI_SAM, {
      method: 'POST',
      url: '/api/v1/AppAnalytics/pwex/addBrowseImpactMetrics',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        404: `Not Found`,
      },
    });
  }
}

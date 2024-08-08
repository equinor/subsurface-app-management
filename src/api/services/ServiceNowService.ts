/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ServiceNowUrgency } from '../models/ServiceNowUrgency';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI_Portal } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ServiceNowService {
  /**
   * @param formData
   * @returns any Success
   * @throws ApiError
   */
  public static createIncident(formData?: {
    ConfigurationItem: string;
    Title: string;
    Description: string;
    CallerEmail: string;
    urgency?: ServiceNowUrgency;
    Images?: Array<Blob>;
  }): CancelablePromise<any> {
    return __request(OpenAPI_Portal, {
      method: 'POST',
      url: '/api/v1/ServiceNow/incident',
      formData: formData,
      mediaType: 'multipart/form-data',
    });
  }
}

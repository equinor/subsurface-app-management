/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { OpenAPI_Portal } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { CancelablePromise, ServiceNowIncidentResponse } from 'src/api';
export class ServiceNowService {
  /**
   * Creates a incident report in service now
   * @param formData
   * @returns any Success
   * @throws ApiError
   */
  public static createIncident(
    formData?: FormData
  ): CancelablePromise<ServiceNowIncidentResponse> {
    return __request(OpenAPI_Portal, {
      method: 'POST',
      url: '/api/v1/ServiceNow/incident',
      body: formData,
    });
  }
}

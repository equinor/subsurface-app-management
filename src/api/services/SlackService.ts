/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from 'src/api';
import { OpenAPI_Portal } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SlackService {
  /**
   * Uploads file to slack and links it to a channel defined in config
   * @param formData
   * @returns any Success
   * @throws ApiError
   */
  public static fileUpload(formData?: {
    ContentType?: string;
    ContentDisposition?: string;
    Headers?: Record<string, Array<string>>;
    Length?: number;
    Name?: string;
    FileName?: string;
    comment?: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI_Portal, {
      method: 'POST',
      url: '/api/v1/Slack/fileUpload',
      formData: formData,
      mediaType: 'multipart/form-data',
    });
  }
  /**
   * Creates a message in the slack channel defined in config
   * @param formData
   * @returns any Success
   * @throws ApiError
   */
  public static postMessage(formData?: {
    comment?: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI_Portal, {
      method: 'POST',
      url: '/api/v1/Slack/postmessage',
      formData: formData,
      mediaType: 'multipart/form-data',
    });
  }
}

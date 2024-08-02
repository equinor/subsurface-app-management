/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI_Portal} from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReleaseNotesService {
  /**
   * @param applicationName
   * @param version
   * @param tags
   * @returns any Success
   * @throws ApiError
   */
  public static getReleasenoteList(
    applicationName?: string,
    version?: string,
    tags?: Array<string>
  ): CancelablePromise<any> {
    return __request(OpenAPI_Portal, {
      method: 'GET',
      url: '/api/v1/ReleaseNotes',
      query: {
        applicationName: applicationName,
        version: version,
        tags: tags,
      },
    });
  }
  /**
   * @param tags
   * @returns any Success
   * @throws ApiError
   */
  public static getMyReleasenotes(
    tags?: Array<string>
  ): CancelablePromise<any> {
    return __request(OpenAPI_Portal, {
      method: 'GET',
      url: '/api/v1/ReleaseNotes/myreleasenotes',
      query: {
        tags: tags,
      },
    });
  }
  /**
   * @param applicationName
   * @param releaseId
   * @returns any Success
   * @throws ApiError
   */
  public static getReleasenote(
    applicationName: string,
    releaseId: string
  ): CancelablePromise<any> {
    return __request(OpenAPI_Portal, {
      method: 'GET',
      url: '/api/v1/ReleaseNotes/{applicationName}/{releaseId}',
      path: {
        applicationName: applicationName,
        releaseId: releaseId,
      },
    });
  }
  /**
   * @returns string Success
   * @throws ApiError
   */
  public static getContainerSasUri(): CancelablePromise<string> {
    return __request(OpenAPI_Portal, {
      method: 'GET',
      url: '/api/v1/ReleaseNotes/GetContainerSasUri',
      errors: {
        401: `Unauthorized`,
      },
    });
  }
}

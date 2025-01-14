/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise, ReleaseNote } from 'src/api';
import { OpenAPI_SAM } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReleaseNotesService {
  /**
   * @returns string Success
   * @throws ApiError
   */
  public static getContainerSasUri(): CancelablePromise<string> {
    return __request(OpenAPI_SAM, {
      method: 'GET',
      url: '/api/v1/ReleaseNotes/GetContainerSasUri',
      errors: {
        401: `Unauthorized`,
      },
    });
  }
  /**
   * Get release note image
   * @param path
   * @returns string OK
   * @throws ApiError
   */
  public static getReleaseNoteImage(path: string): CancelablePromise<string> {
    return __request(OpenAPI_SAM, {
      method: 'GET',
      url: '/api/v1/ReleaseNotes/getreleasenoteimage/{path}',
      path: {
        path: path,
      },
      errors: {
        404: `Not Found`,
      },
    });
  }
  /**
   * Get published release notes
   * @param applicationName
   * @returns ReleaseNote OK
   * @throws ApiError
   */
  public static getPublishedReleasenotes(
    applicationName: string
  ): CancelablePromise<Array<ReleaseNote>> {
    return __request(OpenAPI_SAM, {
      method: 'GET',
      url: '/api/v1/ReleaseNotes/{applicationName}',
      path: {
        applicationName: applicationName,
      },
    });
  }
}

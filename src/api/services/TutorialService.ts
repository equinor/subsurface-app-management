/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { CancelablePromise } from 'src/api';
import { OpenAPI_SAM_Tutorial } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { MyTutorialDto } from 'src/api/models/MyTutorialDto';
export class TutorialService {
  /**
   * Gets My tutorials filtered on my Roles and Groups
   * @param applicationName
   * @param includeDrafts
   * @returns MyTutorialDto OK
   * @throws ApiError
   */
  public static getMyTutorialsForApplication(
    applicationName?: string,
    includeDrafts: boolean = true
  ): CancelablePromise<Array<MyTutorialDto>> {
    return __request(OpenAPI_SAM_Tutorial, {
      method: 'GET',
      url: '/api/v1/Tutorial/me/{includeDrafts}',
      path: {
        includeDrafts: includeDrafts,
      },
      query: {
        applicationName: applicationName,
      },
    });
  }
  /**
   * Gets all draft tutorials for an application
   * @param applicationName
   * @returns TutorialDto OK
   * @throws ApiError
   */
  public static getDraftTutorialsForApplication(
    applicationName: string
  ): CancelablePromise<Array<MyTutorialDto>> {
    return __request(OpenAPI_SAM_Tutorial, {
      method: 'GET',
      url: '/api/v1/Tutorial/draft/{applicationName}',
      path: {
        applicationName: applicationName,
      },
    });
  }
  /**
   * Get tutorial image
   * @param path
   * @returns string OK
   * @throws ApiError
   */
  public static getTutorialImage(path: string): CancelablePromise<string> {
    return __request(OpenAPI_SAM_Tutorial, {
      method: 'GET',
      url: '/api/v1/Tutorial/gettutorialimage/{path}',
      path: {
        path: path,
      },
      errors: {
        404: `Not Found`,
      },
    });
  }
}

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { CancelablePromise, Tutorial } from 'src/api';
import { OpenAPI_JSEMBARK_Prod, OpenAPI_SAM_Prod } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { MyTutorialDto } from 'src/api/models/MyTutorialDto';
export class TutorialService {
  /**
   * Gets all tutorials for Application
   * @param applicationName
   * @returns Tutorial Success
   * @throws ApiError
   */
  public static getTutorialsForApplication(
    applicationName: string
  ): CancelablePromise<Array<Tutorial>> {
    return __request(OpenAPI_JSEMBARK_Prod, {
      method: 'GET',
      url: '/api/v1/Tutorial/{applicationName}',
      path: {
        applicationName: applicationName,
      },
    });
  }
  /**
   * Get A SAS token for Tutorial image container
   * @returns string Success
   * @throws ApiError
   */
  public static getTutorialSasToken(): CancelablePromise<string> {
    return __request(OpenAPI_JSEMBARK_Prod, {
      method: 'GET',
      url: '/api/v1/Tutorial/SASToken',
    });
  }
  // TODO: Replace this endpoint with the proper one when backend is ready
  /**
   * Gets all tutorials for Application
   * @param applicationName
   * @param includeDrafts
   * @returns TutorialDto OK
   * @throws ApiError
   */
  public static getMyTutorials(
    applicationName: string
  ): CancelablePromise<Array<MyTutorialDto>> {
    return __request(OpenAPI_SAM_Prod, {
      method: 'GET',
      url: '/api/v1/Tutorial/{applicationName}/false',
      path: {
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
    return __request(OpenAPI_SAM_Prod, {
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
    return __request(OpenAPI_SAM_Prod, {
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

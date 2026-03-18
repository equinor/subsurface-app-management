/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BugSeverityNullable } from '../models/BugSeverityNullable';
import type { NewWorkItemDto } from '../models/NewWorkItemDto';
import type { SamWorkItemState } from '../models/SamWorkItemState';
import type { SamWorkItemStateNullable } from '../models/SamWorkItemStateNullable';
import type { WorkItem } from '../models/WorkItem';
import type { WorkItemType } from '../models/WorkItemType';
import type { WorkItemTypeNullable } from '../models/WorkItemTypeNullable';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI_SAM } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WorkItemsService {
  /**
   * @param workItemId
   * @param comment
   * @param formData
   * @returns WorkItem OK
   * @throws ApiError
   */
  public static uploadAttachment(
    workItemId?: string,
    comment?: string,
    formData?: {
      file?: Blob;
    }
  ): CancelablePromise<WorkItem> {
    return __request(OpenAPI_SAM, {
      method: 'POST',
      url: '/api/v1/WorkItems/uploadAttachment',
      query: {
        workItemId: workItemId,
        comment: comment,
      },
      formData: formData,
      mediaType: 'multipart/form-data',
    });
  }
  /**
   * @param comment
   * @param requestBody
   * @returns WorkItem OK
   * @throws ApiError
   */
  public static createWorkItemPlain(
    comment?: string,
    requestBody?: NewWorkItemDto
  ): CancelablePromise<WorkItem> {
    return __request(OpenAPI_SAM, {
      method: 'POST',
      url: '/api/v1/WorkItems/CreateWorkItemPlain',
      query: {
        comment: comment,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @param slackComment
   * @param attachmentComment
   * @param formData
   * @returns WorkItem OK
   * @throws ApiError
   */
  public static createWorkItemWithAttachment(
    slackComment?: string,
    attachmentComment?: string,
    formData?: {
      fileList?: Array<Blob>;
      Title?: string;
      Description?: string;
      ApplicationName?: string;
      Browser?: string;
      Field?: string;
      Severity?: BugSeverityNullable;
      WorkItemType?: WorkItemType;
    }
  ): CancelablePromise<WorkItem> {
    return __request(OpenAPI_SAM, {
      method: 'POST',
      url: '/api/v1/WorkItems/CreateWorkItemWithAttachment',
      query: {
        slackComment: slackComment,
        attachmentComment: attachmentComment,
      },
      formData: formData,
      mediaType: 'multipart/form-data',
    });
  }
  /**
   * @param formData
   * @returns WorkItem OK
   * @throws ApiError
   */
  public static updateWorkItem(formData?: {
    Id?: string;
    State?: SamWorkItemState;
    Handler?: string;
    Title?: string;
    Description?: string;
    ApplicationName?: string;
    Browser?: string;
    Field?: string;
    Severity?: BugSeverityNullable;
    WorkItemType?: WorkItemType;
  }): CancelablePromise<WorkItem> {
    return __request(OpenAPI_SAM, {
      method: 'POST',
      url: '/api/v1/WorkItems/UpdateWorkItem',
      formData: formData,
      mediaType: 'multipart/form-data',
    });
  }
  /**
   * @param workItemId
   * @returns WorkItem OK
   * @throws ApiError
   */
  public static getWorkItemById(
    workItemId?: string
  ): CancelablePromise<WorkItem> {
    return __request(OpenAPI_SAM, {
      method: 'GET',
      url: '/api/v1/WorkItems/GetWorkItemById',
      query: {
        workItemId: workItemId,
      },
    });
  }
  /**
   * @param applicationName
   * @param state
   * @param workItemType
   * @returns WorkItem OK
   * @throws ApiError
   */
  public static getAllWorkItemsPerApp(
    applicationName?: string,
    state?: SamWorkItemStateNullable,
    workItemType?: WorkItemTypeNullable
  ): CancelablePromise<Array<WorkItem>> {
    return __request(OpenAPI_SAM, {
      method: 'GET',
      url: '/api/v1/WorkItems/GetAllWorkItemsPerApp',
      query: {
        applicationName: applicationName,
        state: state,
        workItemType: workItemType,
      },
    });
  }
}

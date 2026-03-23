/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BugSeverity } from '../models/BugSeverity';
import type { WorkItem } from '../models/WorkItem';
import type { WorkItemType } from '../models/WorkItemType';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI_SAM } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WorkItemsService {
  /**
   * Creates a workItem in SAM, and creates a userstory or bug in Azure devops.
   * Slack comment is always forwarding the slack message first, and then saves in db and creates userstory.
   * Information can be found in the SAM Azure Devops wiki, in the Upscaling wiki.
   * @param slackComment Creates a slack comment in the feedback channel. If empty, no message will be sent.
   * @param attachmentComment Creates a comment to one of the attachments. If empty, no message will be sent.
   * @param formData
   * @returns WorkItem OK
   * @throws ApiError
   */
  public static createWorkItemWithAttachment(
    slackComment?: string,
    attachmentComment?: string,
    formData?: {
      /**
       * Files to attach to the user stories.
       */
      fileList?: Array<Blob>;
      Title?: string;
      Description?: string;
      ApplicationName?: string;
      Browser?: string;
      Field?: string;
      IssueUrl?: string;
      Severity?: BugSeverity;
      WorkItemType?: WorkItemType;
    }
  ): CancelablePromise<WorkItem> {
    return __request(OpenAPI_SAM, {
      method: 'POST',
      url: '/api/v1/WorkItems/workitem-with-attachment',
      query: {
        slackComment: slackComment,
        attachmentComment: attachmentComment,
      },
      formData: formData,
      mediaType: 'multipart/form-data',
    });
  }
}

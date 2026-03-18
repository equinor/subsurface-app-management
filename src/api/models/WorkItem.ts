/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BugSeverityNullable } from './BugSeverityNullable';
import type { SamWorkItemState } from './SamWorkItemState';
import type { WorkItemAttachment } from './WorkItemAttachment';
import type { WorkItemType } from './WorkItemType';
export type WorkItem = {
  updatedBy?: string | null;
  updatedByName?: string | null;
  updatedDate?: string | null;
  createdBy: string;
  createdByName: string;
  createdDate: string;
  title: string;
  description: string;
  applicationName: string;
  browser?: string | null;
  field?: string | null;
  handler?: string | null;
  severity?: BugSeverityNullable;
  workItemType: WorkItemType;
  id: string;
  state: SamWorkItemState;
  userStoryUrl?: string | null;
  attachments: Array<WorkItemAttachment>;
};

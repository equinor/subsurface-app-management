/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BugSeverityNullable } from './BugSeverityNullable';
import type { WorkItemType } from './WorkItemType';
export type NewWorkItemDto = {
  title: string;
  description: string;
  applicationName: string;
  browser?: string | null;
  field?: string | null;
  severity?: BugSeverityNullable;
  workItemType: WorkItemType;
};

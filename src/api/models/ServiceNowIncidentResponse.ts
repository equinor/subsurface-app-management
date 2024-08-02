/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ServiceNowIncidentAttachmentResponse } from './ServiceNowIncidentAttachmentResponse';
export type ServiceNowIncidentResponse = {
  number: string;
  assignmentGroup: string;
  configurationItem: string;
  title: string;
  description: string;
  caller: string;
  state: string;
  urgency: string;
  sysId: string;
  attachmentResponse?: Array<ServiceNowIncidentAttachmentResponse> | null;
};

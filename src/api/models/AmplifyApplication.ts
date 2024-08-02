/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessRoles } from './AccessRoles';
import type { ApplicationCategory } from './ApplicationCategory';
import type { ContentTab } from './ContentTab';
export type AmplifyApplication = {
  id: string;
  name: string;
  adGroups: Array<string>;
  url: string;
  accessRoles: Array<AccessRoles>;
  description: string;
  contentTabs: Array<ContentTab>;
  longDescription: string;
  category: ApplicationCategory;
  version: string;
  applicationInsightAPI: string;
  apI_Id: string;
  apiurl: string;
  monitored: boolean;
  partnerAccess: boolean;
  productOwners: Array<string>;
  sponsors: Array<string>;
};

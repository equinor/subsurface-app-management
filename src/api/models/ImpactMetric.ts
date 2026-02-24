/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImpactUrl } from './ImpactUrl';
export type ImpactMetric = {
  applicationName: string;
  featureName: string;
  userType: string;
  id: string;
  startTimeStamp?: string;
  endTimeStamp?: string;
  clickCount: number;
  listUrlIds?: Array<ImpactUrl> | null;
  userId: string;
  isSuccessful?: boolean | null;
};

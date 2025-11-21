/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BrowseImpactUrl } from './BrowseImpactUrl';
export type BrowseImpactMetric = {
  id: string;
  startTimeStamp: string;
  endTimeStamp: string;
  clickCount: number;
  listUrlIds?: Array<BrowseImpactUrl> | null;
  userId: string;
  isSuccessful?: boolean | null;
};

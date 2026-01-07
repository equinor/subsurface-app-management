/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BrowseImpactUrlDto } from './BrowseImpactUrlDto';
export type BrowseImpactMetricDto = {
  startTimeStamp: string;
  endTimeStamp: string;
  listUrlIds?: Array<BrowseImpactUrlDto> | null;
  userId: string;
  isSuccessful: boolean;
};

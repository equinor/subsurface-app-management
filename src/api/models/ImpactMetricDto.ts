/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImpactUrlDto } from './ImpactUrlDto';
export type ImpactMetricDto = {
  startTimeStamp: string;
  endTimeStamp: string;
  listUrlIds?: Array<ImpactUrlDto> | null;
  userId: string;
  isSuccessful: boolean;
};

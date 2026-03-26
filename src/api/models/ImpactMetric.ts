/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImpactInteraction } from './ImpactInteraction';
export type ImpactMetric = {
  applicationName: string;
  featureName: string;
  userType?: string;
  id: string;
  startTimeStamp?: string;
  endTimeStamp?: string;
  clickCount: number;
  interactions?: Array<ImpactInteraction> | null;
  userId: string;
  isSuccessful?: boolean | null;
};

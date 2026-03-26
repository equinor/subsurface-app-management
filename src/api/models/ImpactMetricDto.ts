/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImpactInteractionDto } from 'src/api';
export type ImpactMetricDto = {
  featureName: string;
  userType?: string;
  startTimeStamp?: string;
  endTimeStamp?: string;
  Interactions?: Array<ImpactInteractionDto> | null;
  userId: string;
  isSuccessful?: boolean;
};

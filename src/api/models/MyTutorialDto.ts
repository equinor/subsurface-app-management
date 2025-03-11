/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StepDto } from './StepDto';
export type MyTutorialDto = {
  id: string;
  name: string;
  path: string;
  application: string;
  steps: Array<StepDto>;
  willPopUp: boolean;
  tutorialDraftId?: string | null;
};

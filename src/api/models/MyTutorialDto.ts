/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StepDto } from './StepDto';
export type MyTutorialDto = {
  id: string;
  tutorialDraftId?: string | null;
  isInteractive?: boolean | null;
  name: string;
  path: string;
  application: string;
  steps: Array<StepDto>;
  willPopUp: boolean;
};

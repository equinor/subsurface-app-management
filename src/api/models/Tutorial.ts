/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Step } from './Step';
export type Tutorial = {
  id?: string | null;
  name: string;
  shortName: string;
  path: string;
  application: string;
  steps: Array<Step>;
  showInProd: boolean;
  willPopUp: boolean;
  dynamicPositioning?: boolean | null;
};

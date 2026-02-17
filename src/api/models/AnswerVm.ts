/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnswerId } from './AnswerId';
import type { OptionId } from './OptionId';
export type AnswerVm = {
  answerId: AnswerId;
  textAnswer?: string | null;
  numericAnswer?: number | null;
  selectedOptions?: Array<OptionId> | null;
};

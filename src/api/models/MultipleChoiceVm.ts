/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { QuestionOptionDto } from './QuestionOptionDto';
export type MultipleChoiceVm = {
  maxSelectableOptions: number;
  /**
   * The list of selected option IDs for choice questions.
   */
  options: Array<QuestionOptionDto>;
};

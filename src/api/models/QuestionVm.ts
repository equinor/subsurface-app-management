/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnswerVm } from './AnswerVm';
import type { LinearScaleVm } from './LinearScaleVm';
import type { MultipleChoiceVm } from './MultipleChoiceVm';
import type { QuestionId } from './QuestionId';
import type { QuestionType } from './QuestionType';
export type QuestionVm = {
  questionId: QuestionId;
  type: QuestionType;
  /**
   * The text answer provided for text questions.
   */
  questionText: string;
  linearScaleVm?: LinearScaleVm;
  multipleChoiceVm?: MultipleChoiceVm;
  order: number;
  answer?: AnswerVm;
};

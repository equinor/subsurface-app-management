/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnswerVm } from './AnswerVm';
import type { QuestionId } from './QuestionId';
import type { QuestionOptionDto } from './QuestionOptionDto';
import type { QuestionType } from './QuestionType';
export type QuestionVm = {
  questionId: QuestionId;
  type: QuestionType;
  order: number;
  /**
   * The text answer provided for text questions.
   * Only populated if the question type is Text.
   */
  text: string;
  /**
   * The list of selected option IDs for choice questions.
   * Only populated if the question type is MultipleChoice.
   */
  options?: Array<QuestionOptionDto> | null;
  maxSelections?: number | null;
  linearScaleVm?: {
    maxLabel: string;
    maxValue: number;
    minLabel: string;
    minValue: number;
  };
  answer?: AnswerVm;
};

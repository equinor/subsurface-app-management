/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnswerId } from './AnswerId';
import type { OptionId } from './OptionId';
import type { QuestionId } from './QuestionId';
/**
 * Represents an answer to a survey question.
 * Used for public survey responses.
 */
export type AnswerQuestionCommandDto = {
  id: QuestionId;
  answerId?: AnswerId;
  /**
   * The text answer provided for text questions.
   * Only populated if the question type is Text.
   */
  textAnswer?: string | null;
  /**
   * The numeric answer provided for numeric questions.
   * Only populated if the question type is LinearScale.
   */
  numericAnswer?: number | null;
  /**
   * The list of selected option IDs for multiple choice questions.
   * Only populated if the question type is MultipleChoice.
   */
  selectedOptionIds?: Array<OptionId>;
};

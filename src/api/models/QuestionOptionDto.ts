/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OptionId } from './OptionId';
/**
 * Represents a option with all its properties.
 * Used for administering surveys.
 */
export type QuestionOptionDto = {
  id: OptionId;
  /**
   * The text of the option displayed to respondents.
   */
  optionText: string;
  /**
   * Display order of the option within the question.
   */
  order: number;
};

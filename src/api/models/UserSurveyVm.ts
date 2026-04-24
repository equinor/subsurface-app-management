/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { QuestionVm } from './QuestionVm';
import type { SurveyId } from './SurveyId';
import type { SurveyResponseId } from './SurveyResponseId';
import type { SurveyResponseStatus } from './SurveyResponseStatus';
import type { SurveyType } from './SurveyType';
export type UserSurveyVm = {
  surveyId: SurveyId;
  surveyResponseId?: SurveyResponseId;
  status: SurveyResponseStatus;
  surveyType: SurveyType;
  applicationId: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  showConfettiOnComplete: boolean;
  questions: Array<QuestionVm>;
};

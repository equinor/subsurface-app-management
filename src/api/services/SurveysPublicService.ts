/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnswerId } from '../models/AnswerId';
import type { AnswerQuestionCommandDto } from '../models/AnswerQuestionCommandDto';
import type { StartSurveyDto } from '../models/StartSurveyDto';
import type { SurveyResponseId } from '../models/SurveyResponseId';
import type { UserSurveyVm } from '../models/UserSurveyVm';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI_SAM } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SurveysPublicService {
  /**
   * Begins a new survey response for the authenticated user for the specified survey.
   * @param surveyId
   * @param requestBody
   * @returns SurveyResponseId OK
   * @throws ApiError
   */
  public static createSurveyResponse(
    surveyId: string,
    requestBody?: StartSurveyDto
  ): CancelablePromise<SurveyResponseId> {
    return __request(OpenAPI_SAM, {
      method: 'POST',
      url: '/api/v1/surveys/{surveyId}/survey/me',
      path: {
        surveyId: surveyId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        404: `Not Found`,
        409: `Conflict`,
        422: `Unprocessable Content`,
      },
    });
  }
  /**
   * Returns the active survey for the application that the user has not yet answered for that application.
   * Only returns an Sam.Api.Enums.Surveys.SurveyState.Active survey for the application that the authenticated user has not completed or opted out of.
   * @param applicationName The name of the application.
   * @returns UserSurveyVm The active survey for the application to prompt the user with. Null if no active survey is available.
   * @throws ApiError
   */
  public static getActiveSurveyForApplication(
    applicationName: string
  ): CancelablePromise<UserSurveyVm | null> {
    return __request(OpenAPI_SAM, {
      method: 'GET',
      url: '/api/v1/surveys/applications/{applicationName}/me',
      path: {
        applicationName: applicationName,
      },
    });
  }
  /**
   * Updates or creates the authenticated user's answer to the question.
   * ## Business Rules:
   * One answer per user per question.
   *
   * ## Restrictions:
   * - The OptionIds listed must exist for that question
   * - The number of OptionIds listed cannot exceed Sam.Api.Models.Dto.SurveyPublic.Response.QuestionPublicDto.MaxSelections for the question.
   * - Survey must be Sam.Api.Enums.Surveys.SurveyState.Active
   * - User cannot have Sam.Api.Enums.Surveys.SurveyResponseStatus.Completed the survey or Sam.Api.Enums.Surveys.SurveyResponseStatus.OptedOut.
   * @param surveyResponseId
   * @param requestBody
   * @returns AnswerId The updated answer.
   * @throws ApiError
   */
  public static upsertSurveyResponse(
    surveyResponseId: string,
    requestBody?: AnswerQuestionCommandDto
  ): CancelablePromise<AnswerId> {
    return __request(OpenAPI_SAM, {
      method: 'PUT',
      url: '/api/v1/surveys/{surveyResponseId}/responses/me',
      path: {
        surveyResponseId: surveyResponseId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        404: `Survey or question with the specified ID was not found or survey is not active.`,
        409: `Cannot update answer due to status being completed or opted out.`,
        422: `The provided answer data is invalid.`,
      },
    });
  }
}

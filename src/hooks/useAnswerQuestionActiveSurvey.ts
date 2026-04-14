import { useMutation } from '@tanstack/react-query';

import { AnswerQuestionCommandDto, SurveysPublicService } from 'src/api';

export function useAnswerQuestionActiveSurvey() {
  return useMutation({
    mutationFn: ({
      surveyResponseId,
      body,
    }: {
      surveyResponseId: string;
      body: AnswerQuestionCommandDto;
    }) => SurveysPublicService.upsertSurveyResponse(surveyResponseId, body),
  });
}

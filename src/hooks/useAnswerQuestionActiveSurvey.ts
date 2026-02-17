import { useMutation } from '@tanstack/react-query';

import { AnswerQuestionCommandDto, SurveysPublicService } from 'src/api';
import { useActiveSurvey } from 'src/hooks/useActiveSurvey';

export function useAnswerQuestionActiveSurvey() {
  const { data: activeSurvey } = useActiveSurvey();

  return useMutation({
    mutationFn: (body: AnswerQuestionCommandDto) =>
      SurveysPublicService.updateSurveyResponse(
        activeSurvey?.surveyResponseId?.value ?? '',
        body
      ),
  });
}

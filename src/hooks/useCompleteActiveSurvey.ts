import { useMutation, useQueryClient } from '@tanstack/react-query';

import { SurveysPublicService, UserSurveyVm } from 'src/api';
import { GET_SURVEY_FOR_APP } from 'src/constants';

export function useCompleteActiveSurvey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (surveyResponseId: string) =>
      SurveysPublicService.finalizeSurveyResponse(surveyResponseId),
    onSuccess: () => {
      /* v8 ignore start */
      queryClient.setQueryData<UserSurveyVm>([GET_SURVEY_FOR_APP], undefined);
      /* v8 ignore end */
    },
  });
}

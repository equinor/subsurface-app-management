import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  StartSurveyDto,
  SurveyResponseStatus,
  SurveysPublicService,
  UserSurveyVm,
} from 'src/api';
import { GET_SURVEY_FOR_APP } from 'src/constants';
import { useActiveSurvey } from 'src/hooks/useActiveSurvey';

export function useRespondActiveSurvey() {
  const { data: activeSurvey } = useActiveSurvey();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: StartSurveyDto) => {
      const data = await SurveysPublicService.createSurveyResponse(
        activeSurvey?.surveyId.value ?? '',
        body
      );
      queryClient.setQueryData<UserSurveyVm>(
        [GET_SURVEY_FOR_APP],
        (oldData) => {
          if (!oldData) return oldData;
          if (body.optOut) return undefined;

          return {
            ...oldData,
            surveyResponseId: data,
            status: SurveyResponseStatus.IN_PROGRESS,
          };
        }
      );

      return data;
    },
  });
}

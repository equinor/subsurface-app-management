import { useQuery } from '@tanstack/react-query';

import { SurveysPublicService } from 'src/api';
import { GET_SURVEY_FOR_APP } from 'src/constants';
import { getAppName } from 'src/utils/environment';

export function useActiveSurvey() {
  return useQuery({
    queryKey: [GET_SURVEY_FOR_APP],
    queryFn: () =>
      SurveysPublicService.getActiveSurveyForApplication(
        getAppName(import.meta.env.VITE_NAME)
      ),
    select: (data) => {
      if (data === null) {
        return null;
      }

      return {
        ...data,
        questions: data.questions
          .toSorted((a, b) => a.order - b.order)
          .map((question) => ({
            ...question,
            options: question.multipleChoiceVm?.options.toSorted(
              (a, b) => a.order - b.order
            ),
          })),
      };
    },
  });
}

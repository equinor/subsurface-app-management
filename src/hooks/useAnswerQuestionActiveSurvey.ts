import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  AnswerQuestionCommandDto,
  SurveysPublicService,
  UserSurveyVm,
} from 'src/api';
import { GET_SURVEY_FOR_APP } from 'src/constants';

export function useAnswerQuestionActiveSurvey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      surveyResponseId,
      body,
    }: {
      surveyResponseId: string;
      body: AnswerQuestionCommandDto;
    }) => SurveysPublicService.upsertSurveyResponse(surveyResponseId, body),
    onSuccess: (data, context) => {
      /* v8 ignore start */
      queryClient.setQueryData<UserSurveyVm>(
        [GET_SURVEY_FOR_APP],
        (oldData) => {
          const copy = structuredClone(oldData);

          const updatedQuestion = copy?.questions.find(
            (q) => q.questionId.value === context.body.id.value
          );

          if (updatedQuestion) {
            updatedQuestion.answer = { ...context.body, answerId: data };
          }

          return copy;
        }
      );
      /* v8 ignore end */
    },
  });
}

import { ReactNode } from 'react';
import { act, createElement } from 'react';

import { faker } from '@faker-js/faker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useAnswerQuestionActiveSurvey } from './useAnswerQuestionActiveSurvey';
import { AnswerQuestionCommandDto } from 'src/api';
import { SurveysPublicService } from 'src/api/services/SurveysPublicService';
import { renderHook, waitFor } from 'src/tests/test-utils';

vi.mock('src/api/services/SurveysPublicService', () => ({
  SurveysPublicService: {
    upsertSurveyResponse: vi.fn(),
  },
}));

const mockUpsertSurveyResponse = vi.mocked(
  SurveysPublicService.upsertSurveyResponse
);

function Wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return createElement(QueryClientProvider, { client: queryClient }, children);
}

test('calls upsertSurveyResponse with the correct arguments', async () => {
  const answerId = { value: faker.string.uuid() };
  mockUpsertSurveyResponse.mockResolvedValue(answerId);

  const surveyResponseId = faker.string.uuid();
  const body: AnswerQuestionCommandDto = {
    id: { value: faker.string.uuid() },
    textAnswer: faker.lorem.sentence(),
  };

  const { result } = renderHook(() => useAnswerQuestionActiveSurvey(), {
    wrapper: Wrapper,
  });

  act(() => {
    result.current.mutate({ surveyResponseId, body });
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(mockUpsertSurveyResponse).toHaveBeenCalledWith(surveyResponseId, body);
  expect(result.current.data).toEqual(answerId);
});

test('exposes mutation error when the request fails', async () => {
  const error = new Error('Server error');
  mockUpsertSurveyResponse.mockRejectedValue(error);

  const { result } = renderHook(() => useAnswerQuestionActiveSurvey(), {
    wrapper: Wrapper,
  });

  act(() => {
    result.current.mutate({
      surveyResponseId: faker.string.uuid(),
      body: { id: { value: faker.string.uuid() } },
    });
  });

  await waitFor(() => expect(result.current.isError).toBe(true));

  expect(result.current.error).toBe(error);
});

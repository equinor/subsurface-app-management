import { ReactNode } from 'react';
import { act, createElement } from 'react';

import { faker } from '@faker-js/faker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useCompleteActiveSurvey } from './useCompleteActiveSurvey';
import { SurveysPublicService } from 'src/api/services/SurveysPublicService';
import { renderHook, waitFor } from 'src/tests/test-utils';

vi.mock('src/api/services/SurveysPublicService', () => ({
  SurveysPublicService: {
    finalizeSurveyResponse: vi.fn(),
  },
}));

const mockFinalizeSurveyResponse = vi.mocked(
  SurveysPublicService.finalizeSurveyResponse
);

function makeWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
}

test('calls finalizeSurveyResponse with the correct surveyResponseId', async () => {
  mockFinalizeSurveyResponse.mockResolvedValue(undefined);

  const surveyResponseId = faker.string.uuid();
  const queryClient = makeQueryClient();

  const { result } = renderHook(() => useCompleteActiveSurvey(), {
    wrapper: makeWrapper(queryClient),
  });

  act(() => {
    result.current.mutate(surveyResponseId);
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(mockFinalizeSurveyResponse).toHaveBeenCalledWith(surveyResponseId);
});

test('exposes mutation error when the request fails', async () => {
  const error = new Error('Server error');
  mockFinalizeSurveyResponse.mockRejectedValue(error);

  const queryClient = makeQueryClient();

  const { result } = renderHook(() => useCompleteActiveSurvey(), {
    wrapper: makeWrapper(queryClient),
  });

  act(() => {
    result.current.mutate(faker.string.uuid());
  });

  await waitFor(() => expect(result.current.isError).toBe(true));

  expect(result.current.error).toBe(error);
});

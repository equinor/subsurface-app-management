import { ReactNode } from 'react';
import { act, createElement } from 'react';

import { faker } from '@faker-js/faker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useRespondActiveSurvey } from './useRespondActiveSurvey';
import {
  StartSurveyDto,
  SurveyResponseStatus,
  SurveyType,
  UserSurveyVm,
} from 'src/api';
import { SurveysPublicService } from 'src/api/services/SurveysPublicService';
import { GET_SURVEY_FOR_APP } from 'src/constants';
import { renderHook, waitFor } from 'src/tests/test-utils';

vi.mock('src/api/services/SurveysPublicService', () => ({
  SurveysPublicService: {
    createSurveyResponse: vi.fn(),
  },
}));

const mockCreateSurveyResponse = vi.mocked(
  SurveysPublicService.createSurveyResponse
);

const fakeSurveyId = { value: faker.string.uuid() };

const fakeExistingSurvey: UserSurveyVm = {
  surveyId: fakeSurveyId,
  status: SurveyResponseStatus.NOT_STARTED,
  surveyType: SurveyType.DEFAULT,
  applicationId: faker.string.uuid(),
  title: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
  startAt: faker.date.past().toISOString(),
  endAt: faker.date.future().toISOString(),
  showConfettiOnComplete: false,
  questions: [],
};

function makeWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };
}

function makeQueryClient(initialData?: UserSurveyVm) {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  if (initialData !== undefined) {
    queryClient.setQueryData([GET_SURVEY_FOR_APP], initialData);
  }
  return queryClient;
}

test('calls createSurveyResponse with the correct arguments', async () => {
  const newResponseId = { value: faker.string.uuid() };
  mockCreateSurveyResponse.mockResolvedValue(newResponseId);

  const queryClient = makeQueryClient(fakeExistingSurvey);
  const body: StartSurveyDto = { surveyId: fakeSurveyId, optOut: false };

  const { result } = renderHook(() => useRespondActiveSurvey(), {
    wrapper: makeWrapper(queryClient),
  });

  act(() => {
    result.current.mutate(body);
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(mockCreateSurveyResponse).toHaveBeenCalledWith(
    fakeSurveyId.value,
    body
  );
});

test('updates cache with new surveyResponseId and IN_PROGRESS status', async () => {
  const newResponseId = { value: faker.string.uuid() };
  mockCreateSurveyResponse.mockResolvedValue(newResponseId);

  const queryClient = makeQueryClient(fakeExistingSurvey);
  const body: StartSurveyDto = { surveyId: fakeSurveyId, optOut: false };

  const { result } = renderHook(() => useRespondActiveSurvey(), {
    wrapper: makeWrapper(queryClient),
  });

  act(() => {
    result.current.mutate(body);
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  const cached = queryClient.getQueryData<UserSurveyVm>([GET_SURVEY_FOR_APP]);
  expect(cached?.surveyResponseId).toEqual(newResponseId);
  expect(cached?.status).toBe(SurveyResponseStatus.IN_PROGRESS);
});

test('calls createSurveyResponse and succeeds when optOut is true', async () => {
  const newResponseId = { value: faker.string.uuid() };
  mockCreateSurveyResponse.mockResolvedValue(newResponseId);

  const queryClient = makeQueryClient(fakeExistingSurvey);
  const body: StartSurveyDto = { surveyId: fakeSurveyId, optOut: true };

  const { result } = renderHook(() => useRespondActiveSurvey(), {
    wrapper: makeWrapper(queryClient),
  });

  act(() => {
    result.current.mutate(body);
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(mockCreateSurveyResponse).toHaveBeenCalledWith(
    fakeSurveyId.value,
    body
  );
  expect(result.current.data).toEqual(newResponseId);
});

test('does not modify cache when no existing survey data is present', async () => {
  const newResponseId = { value: faker.string.uuid() };
  mockCreateSurveyResponse.mockResolvedValue(newResponseId);

  const queryClient = makeQueryClient();
  const body: StartSurveyDto = { surveyId: fakeSurveyId, optOut: false };

  const { result } = renderHook(() => useRespondActiveSurvey(), {
    wrapper: makeWrapper(queryClient),
  });

  act(() => {
    result.current.mutate(body);
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  const cached = queryClient.getQueryData([GET_SURVEY_FOR_APP]);
  expect(cached).toBeUndefined();
});

test('returns the new surveyResponseId from the mutation', async () => {
  const newResponseId = { value: faker.string.uuid() };
  mockCreateSurveyResponse.mockResolvedValue(newResponseId);

  const queryClient = makeQueryClient(fakeExistingSurvey);
  const body: StartSurveyDto = { surveyId: fakeSurveyId, optOut: false };

  const { result } = renderHook(() => useRespondActiveSurvey(), {
    wrapper: makeWrapper(queryClient),
  });

  act(() => {
    result.current.mutate(body);
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(result.current.data).toEqual(newResponseId);
});

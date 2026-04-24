import { ReactNode } from 'react';
import { createElement } from 'react';

import { faker } from '@faker-js/faker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useActiveSurvey } from './useActiveSurvey';
import { SurveyResponseStatus, SurveyType, UserSurveyVm } from 'src/api';
import { SurveysPublicService } from 'src/api/services/SurveysPublicService';
import { renderHook, waitFor } from 'src/tests/test-utils';

const APP_NAME = 'TestApp';

const makeFakeSurvey = (overrides?: Partial<UserSurveyVm>): UserSurveyVm => ({
  surveyId: { value: faker.string.uuid() },
  status: SurveyResponseStatus.NOT_STARTED,
  surveyType: SurveyType.DEFAULT,
  applicationId: faker.string.uuid(),
  title: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
  startAt: faker.date.past().toISOString(),
  endAt: faker.date.future().toISOString(),
  showConfettiOnComplete: false,
  questions: [],
  ...overrides,
});

vi.mock('src/api/services/SurveysPublicService', () => ({
  SurveysPublicService: {
    getActiveSurveyForApplication: vi.fn(),
  },
}));

vi.stubEnv('VITE_NAME', APP_NAME);

function Wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return createElement(QueryClientProvider, { client: queryClient }, children);
}

const mockGetActiveSurvey = vi.mocked(
  SurveysPublicService.getActiveSurveyForApplication
);

test('calls the service with the app name from env', async () => {
  mockGetActiveSurvey.mockResolvedValue(makeFakeSurvey());

  renderHook(() => useActiveSurvey(), { wrapper: Wrapper });

  await waitFor(() =>
    expect(mockGetActiveSurvey).toHaveBeenCalledWith(APP_NAME)
  );
});

test('returns null when the API returns null', async () => {
  mockGetActiveSurvey.mockResolvedValue(null);

  const { result } = renderHook(() => useActiveSurvey(), { wrapper: Wrapper });

  await waitFor(() => expect(result.current.data).toBeNull());
});

test('sorts questions by order', async () => {
  const survey = makeFakeSurvey({
    questions: [
      {
        questionId: { value: faker.string.uuid() },
        type: 'Text' as never,
        order: 3,
        questionText: 'Third',
      },
      {
        questionId: { value: faker.string.uuid() },
        type: 'Text' as never,
        order: 1,
        questionText: 'First',
      },
      {
        questionId: { value: faker.string.uuid() },
        type: 'Text' as never,
        order: 2,
        questionText: 'Second',
      },
    ],
  });

  mockGetActiveSurvey.mockResolvedValue(survey);

  const { result } = renderHook(() => useActiveSurvey(), { wrapper: Wrapper });

  await waitFor(() => expect(result.current.data).not.toBeUndefined());

  const orders = result.current.data!.questions.map((q) => q.order);
  expect(orders).toEqual([1, 2, 3]);
});

test('sorts options within each question by order', async () => {
  const survey = makeFakeSurvey({
    questions: [
      {
        questionId: { value: faker.string.uuid() },
        type: 'MultipleChoice' as never,
        order: 1,
        questionText: 'Pick one',
        multipleChoiceVm: {
          maxSelectableOptions: 1,
          options: [
            { id: { value: faker.string.uuid() }, optionText: 'A', order: 1 },
            { id: { value: faker.string.uuid() }, optionText: 'B', order: 2 },
            { id: { value: faker.string.uuid() }, optionText: 'C', order: 3 },
          ],
        },
      },
    ],
  });

  mockGetActiveSurvey.mockResolvedValue(survey);

  const { result } = renderHook(() => useActiveSurvey(), { wrapper: Wrapper });

  await waitFor(() => expect(result.current.data).not.toBeUndefined());

  const optionOrders = result.current.data!.questions[0].options!.map(
    (o) => o.order
  );
  expect(optionOrders).toEqual([1, 2, 3]);
});

test('handles questions without options gracefully', async () => {
  const survey = makeFakeSurvey({
    questions: [
      {
        questionId: { value: faker.string.uuid() },
        type: 'Text' as never,
        order: 1,
        questionText: 'Open ended',
        multipleChoiceVm: {
          maxSelectableOptions: 1,
          options: [],
        },
      },
    ],
  });

  mockGetActiveSurvey.mockResolvedValue(survey);

  const { result } = renderHook(() => useActiveSurvey(), { wrapper: Wrapper });

  await waitFor(() => expect(result.current.data).not.toBeUndefined());

  expect(
    result.current.data!.questions[0].multipleChoiceVm?.options
  ).toStrictEqual([]);
});

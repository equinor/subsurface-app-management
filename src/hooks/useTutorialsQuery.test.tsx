import { ReactNode } from 'react';

import { faker } from '@faker-js/faker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useTutorialsQuery } from './useTutorialsQuery';
import { MyTutorialDto } from 'src/api';
import { renderHook, waitFor } from 'src/tests/test-utils';
import { EnvironmentType } from 'src/types';

function fakeTutorial(index: number): MyTutorialDto {
  return {
    id: faker.string.uuid(),
    name: faker.lorem.sentence(),
    application: 'MyApp',
    willPopUp: index % 2 === 0,
    path: '/tutorials',
    steps: new Array(faker.number.int({ min: 2, max: 5 })).fill(0).map(() => ({
      id: faker.string.uuid(),
      title: faker.book.title(),
      body: faker.lorem.sentence(1),
    })),
    tutorialDraftId: index % 2 === 0 ? faker.string.uuid() : null,
  };
}
const FAKE_PROD_TUTORIALS = new Array(faker.number.int({ min: 3, max: 5 }))
  .fill(0)
  .map((_, index) => fakeTutorial(index));

const FAKE_DRAFT_TUTORIALS = new Array(faker.number.int({ min: 3, max: 5 }))
  .fill(0)
  .map((_, index) => fakeTutorial(index));

vi.mock('src/api', () => {
  class TutorialService {
    static async getMyTutorialsForApplication() {
      return new Promise((resolve) => {
        setTimeout(() => resolve(FAKE_PROD_TUTORIALS), 500);
      });
    }
    static async getDraftTutorialsForApplication() {
      return new Promise((resolve) => {
        setTimeout(() => resolve(FAKE_DRAFT_TUTORIALS), 500);
      });
    }
  }

  return { TutorialService };
});

function Wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

test('Returns prod tutorials if in prod env', async () => {
  vi.stubEnv('VITE_ENVIRONMENT_NAME', EnvironmentType.PRODUCTION);

  const { result } = renderHook(() => useTutorialsQuery(), {
    wrapper: Wrapper,
  });

  await waitFor(() => expect(result.current.data).not.toBeUndefined());

  expect(
    result.current.data?.every((tutorial) =>
      FAKE_PROD_TUTORIALS.some(
        (item) =>
          item.id === tutorial.id || item.tutorialDraftId === tutorial.id
      )
    )
  ).toBeTruthy();
  expect(result.current.data?.length).toBe(FAKE_PROD_TUTORIALS.length);
});

test('Returns draft tutorials if not in prod env', async () => {
  vi.stubEnv('VITE_ENVIRONMENT_NAME', EnvironmentType.DEVELOP);

  const { result } = renderHook(() => useTutorialsQuery(), {
    wrapper: Wrapper,
  });

  await waitFor(() => expect(result.current.data).not.toBeUndefined());

  expect(
    result.current.data?.every((tutorial) =>
      FAKE_DRAFT_TUTORIALS.some((item) => item.id === tutorial.id)
    )
  ).toBeTruthy();
  expect(result.current.data?.length).toBe(FAKE_DRAFT_TUTORIALS.length);
});

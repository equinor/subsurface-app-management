import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { faker } from '@faker-js/faker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act } from '@testing-library/react';

import { TutorialProvider, useTutorials } from './TutorialProvider';
import { MyTutorialDto } from 'src/api';
import {
  SEEN_TUTORIALS_LOCALSTORAGE_KEY,
  useSeenTutorials,
} from 'src/providers/TutorialProvider/useSeenTutorials';
import { renderHook, waitFor } from 'src/tests/test-utils';

import { expect } from 'vitest';

const FAKE_TUTORIALS: MyTutorialDto[] = new Array(
  faker.number.int({ min: 3, max: 5 })
)
  .fill(0)
  .map((_, index) => ({
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
  }));

vi.mock('src/hooks/useTutorialsQuery', () => {
  const useTutorialsQuery = () => {
    return {
      data: FAKE_TUTORIALS,
    };
  };

  return { useTutorialsQuery };
});

function Wrapper({
  initialEntry,
  children,
}: {
  initialEntry?: string;
  children: ReactNode;
}) {
  const queryClient = new QueryClient();

  return (
    <MemoryRouter initialEntries={initialEntry ? [initialEntry] : undefined}>
      <QueryClientProvider client={queryClient}>
        <TutorialProvider>{children}</TutorialProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );
}

test('Returns expected tutorials', async () => {
  const { result } = renderHook(() => useTutorials(), { wrapper: Wrapper });

  await waitFor(
    () => result.current.allTutorials.length === FAKE_TUTORIALS.length
  );

  for (const tutorial of result.current.allTutorials) {
    expect(FAKE_TUTORIALS.some((item) => item.id === tutorial.id)).toBeTruthy();
  }
});

test('Returns tutorials on this page as expected', async () => {
  const { result } = renderHook(() => useTutorials(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <Wrapper initialEntry="/some-other-page">{children}</Wrapper>
    ),
  });

  await waitFor(
    () => result.current.allTutorials.length === FAKE_TUTORIALS.length
  );

  expect(result.current.tutorialsOnThisPage.length).toBe(0);
});

test('Should be able to set active tutorial', async () => {
  const { result } = renderHook(() => useTutorials(), { wrapper: Wrapper });

  await waitFor(
    () => result.current.allTutorials.length === FAKE_TUTORIALS.length
  );

  act(() => {
    result.current.startTutorial(FAKE_TUTORIALS[0].id);
  });

  expect(result.current.activeTutorial?.id).toBe(FAKE_TUTORIALS[0].id);
  expect(result.current.activeStep).toBe(0);
});

test('Trying to set active tutorial to something that doesnt exist throws error', async () => {
  const { result } = renderHook(() => useTutorials(), { wrapper: Wrapper });

  await waitFor(
    () => result.current.allTutorials.length === FAKE_TUTORIALS.length
  );

  expect(() =>
    result.current.startTutorial('some-id-that-doesnt-exist')
  ).toThrowError();
});

test('Trying to go to next/previous step without active tutorials throws error', async () => {
  const { result } = renderHook(() => useTutorials(), { wrapper: Wrapper });

  await waitFor(
    () => result.current.allTutorials.length === FAKE_TUTORIALS.length
  );

  expect(() => result.current.goToNextStep()).toThrowError();
  expect(() => result.current.goToPreviousStep()).toThrowError();
});

test('Going to next step works as expected', async () => {
  const { result } = renderHook(() => useTutorials(), { wrapper: Wrapper });

  await waitFor(
    () => result.current.allTutorials.length === FAKE_TUTORIALS.length
  );

  const randomTutorial = faker.helpers.arrayElement(FAKE_TUTORIALS);

  act(() => {
    result.current.startTutorial(randomTutorial.id);
  });

  act(() => {
    result.current.goToNextStep();
  });

  expect(result.current.activeStep).toBe(1);

  while (
    (result.current.activeStep as number) <=
    randomTutorial.steps.length - 1
  ) {
    act(() => {
      result.current.goToNextStep();
    });
  }

  expect(result.current.activeTutorial).toBeUndefined();
  expect(result.current.activeStep).toBeUndefined();
});

test('Going to previous step works as expected', async () => {
  const { result } = renderHook(() => useTutorials(), { wrapper: Wrapper });

  await waitFor(
    () => result.current.allTutorials.length === FAKE_TUTORIALS.length
  );

  const randomTutorial = faker.helpers.arrayElement(FAKE_TUTORIALS);

  act(() => {
    result.current.startTutorial(randomTutorial.id);
  });

  act(() => {
    result.current.goToNextStep();
  });

  expect(result.current.activeStep).toBe(1);

  act(() => {
    result.current.goToPreviousStep();
  });

  expect(result.current.activeStep).toBe(0);

  act(() => {
    result.current.goToPreviousStep();
  });

  expect(result.current.activeTutorial).toBeUndefined();
  expect(result.current.activeStep).toBeUndefined();
});

test('Seen tutorials works as expected', async () => {
  vi.stubEnv('VITE_NAME', 'MyApp');
  const randomTutorial = faker.helpers.arrayElement(FAKE_TUTORIALS);
  window.localStorage.setItem(
    SEEN_TUTORIALS_LOCALSTORAGE_KEY,
    JSON.stringify([randomTutorial.id])
  );

  const { result } = renderHook(() => useTutorials(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <Wrapper initialEntry="/tutorials">{children}</Wrapper>
    ),
  });

  expect(result.current.unseenTutorialsOnThisPage).not.toContain(
    randomTutorial
  );
});

test('Logs error if local storage is in unexpected format', async () => {
  const spy = vi.spyOn(console, 'error');

  vi.stubEnv('VITE_NAME', 'MyApp');
  window.localStorage.setItem(
    SEEN_TUTORIALS_LOCALSTORAGE_KEY,
    'some random data'
  );

  renderHook(() => useSeenTutorials());

  expect(spy).toHaveBeenCalled();

  window.localStorage.setItem(SEEN_TUTORIALS_LOCALSTORAGE_KEY, '[1,2,3]');

  renderHook(() => useSeenTutorials());

  expect(spy).toHaveBeenCalled();
});

test('Skip tutorial works as expected', async () => {
  vi.stubEnv('VITE_NAME', 'MyApp');
  const randomTutorial = faker.helpers.arrayElement(FAKE_TUTORIALS);

  const { result } = renderHook(() => useTutorials(), { wrapper: Wrapper });

  act(() => result.current.skipTutorial(randomTutorial.id));

  expect(
    JSON.parse(
      window.localStorage.getItem(SEEN_TUTORIALS_LOCALSTORAGE_KEY) ?? '[]'
    )
  ).toContain(randomTutorial.id);
});

test("'useTutorials' throws error if used outside provider", async () => {
  expect(() => renderHook(() => useTutorials())).toThrowError();
});

test('Calling skipTutorial when a tutorial is active works as expected', async () => {
  const { result } = renderHook(() => useTutorials(), { wrapper: Wrapper });

  await waitFor(
    () => result.current.allTutorials.length === FAKE_TUTORIALS.length
  );

  const randomTutorial = faker.helpers.arrayElement(FAKE_TUTORIALS);

  act(() => {
    result.current.startTutorial(randomTutorial.id);
  });

  act(() => {
    result.current.goToNextStep();
  });

  expect(result.current.activeStep).toBe(1);

  act(() => {
    result.current.skipTutorial(randomTutorial.id);
  });

  expect(result.current.activeTutorial).toBeUndefined();
  expect(result.current.activeStep).toBeUndefined();
});

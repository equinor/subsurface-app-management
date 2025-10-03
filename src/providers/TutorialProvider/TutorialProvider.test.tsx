import { ReactNode } from 'react';

import { faker } from '@faker-js/faker';
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router';
import { act } from '@testing-library/react';

import { TutorialProvider, useTutorials } from './TutorialProvider';
import { MyTutorialDto } from 'src/api';
import { GET_TUTORIAL_STEP_IMAGE } from 'src/constants';
import {
  SEEN_TUTORIALS_LOCALSTORAGE_KEY,
  useSeenTutorials,
} from 'src/providers/TutorialProvider/useSeenTutorials';
import { renderHook, waitFor } from 'src/tests/test-utils';

import { expect } from 'vitest';

const FAKE_IMAGE_PATH = 'some-path';

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
      imgUrl: index === 0 ? FAKE_IMAGE_PATH : undefined,
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

vi.mock('src/api/services/TutorialService', () => {
  class TutorialService {
    public static getTutorialImage(path: string) {
      return new Promise((resolve) => {
        resolve(path);
      });
    }
  }

  return { TutorialService };
});

function createTestRouter(children: ReactNode, initialEntry?: string) {
  const rootRoute = createRootRoute({
    component: () => (
      <TutorialProvider>
        <Outlet />
      </TutorialProvider>
    ),
  });
  const tutorialsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => children,
  });
  const someOther = createRoute({
    getParentRoute: () => rootRoute,
    path: '/some-other-page',
    component: () => children,
  });
  const routeTree = rootRoute.addChildren([tutorialsRoute, someOther]);
  return createRouter({
    routeTree: routeTree,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    history: createMemoryHistory({
      initialEntries: initialEntry ? [initialEntry] : ['/'],
    }),
  });
}

function Wrapper({
  initialEntry,
  children,
}: {
  initialEntry?: string;
  children: ReactNode;
}) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={createTestRouter(children, initialEntry)} />
    </QueryClientProvider>
  );
}

async function renderHookWithWrapper() {
  return await act(() =>
    renderHook(() => useTutorials(), { wrapper: Wrapper })
  );
}

test('Returns expected tutorials', async () => {
  const { result } = await renderHookWithWrapper();

  await waitFor(
    () => result.current.allTutorials.length === FAKE_TUTORIALS.length
  );

  for (const tutorial of result.current.allTutorials) {
    expect(FAKE_TUTORIALS.some((item) => item.id === tutorial.id)).toBeTruthy();
  }
});

test('Pre-fetches images', async () => {
  const { result } = await renderHookWithWrapper();

  await waitFor(
    () => result.current.allTutorials.length === FAKE_TUTORIALS.length
  );

  expect(() =>
    renderHook(() => useQueryClient(), {
      wrapper: Wrapper,
    }).result.current.getQueryData([GET_TUTORIAL_STEP_IMAGE, FAKE_IMAGE_PATH])
  ).toBeDefined();
});

test('Returns tutorials on this page as expected', async () => {
  const { result } = await act(() =>
    renderHook(() => useTutorials(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <Wrapper initialEntry="/some-other-page">{children}</Wrapper>
      ),
    })
  );

  await waitFor(
    () => result.current.allTutorials.length === FAKE_TUTORIALS.length
  );

  expect(result.current.tutorialsOnThisPage.length).toBe(0);
});

test('Should be able to set active tutorial', async () => {
  const { result } = await renderHookWithWrapper();

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
  const { result } = await renderHookWithWrapper();

  await waitFor(
    () => result.current.allTutorials.length === FAKE_TUTORIALS.length
  );

  expect(() =>
    result.current.startTutorial('some-id-that-doesnt-exist')
  ).toThrowError();
});

test('Trying to go to next/previous step without active tutorials throws error', async () => {
  const { result } = await renderHookWithWrapper();

  await waitFor(
    () => result.current.allTutorials.length === FAKE_TUTORIALS.length
  );

  expect(() => result.current.goToNextStep()).toThrowError();
  expect(() => result.current.goToPreviousStep()).toThrowError();
});

test('Going to next step works as expected', async () => {
  const { result } = await renderHookWithWrapper();

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
  const { result } = await renderHookWithWrapper();

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

  const { result } = await renderHookWithWrapper();

  await waitFor(() =>
    expect(result.current.unseenTutorialsOnThisPage).not.toContain(
      randomTutorial
    )
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

  const { result } = await renderHookWithWrapper();

  // Wait for init
  await waitFor(() => result.current);

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
  const { result } = await renderHookWithWrapper();

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

import { act, ReactNode } from 'react';

import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router';

import { FeatureRoute } from './FeatureRoute';
import { CancelablePromise } from 'src/api';
import { TutorialProvider } from 'src/providers';
import { renderWithProviders, screen } from 'src/tests/test-utils';

enum Scenarios {
  WITH_FEATURES_KEY = 'withFeatures',
  WITHOUT_FEATURES_KEY = 'withoutFeatures',
}

vi.mock('src/api/services/FeatureToggleService', () => {
  class FeatureToggleService {
    public static getMyFeatures(): CancelablePromise<unknown> {
      return new CancelablePromise((resolve) => {
        setTimeout(() => {
          resolve([{ uuid: Scenarios.WITH_FEATURES_KEY, active: true }]);
        }, 300);
      });
    }
  }
  return { FeatureToggleService };
});

function renderTestRouter(children: ReactNode) {
  const rootRoute = createRootRoute({
    component: () => (
      <TutorialProvider>
        <Outlet />
      </TutorialProvider>
    ),
  });
  const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <p>home</p>,
  });
  const otherRouter = createRoute({
    getParentRoute: () => rootRoute,
    path: '/other',
    component: () => <p>other</p>,
  });
  const testRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/test',
    component: () => children,
  });
  const routeTree = rootRoute.addChildren([homeRoute, otherRouter, testRoute]);
  const router = createRouter({
    routeTree: routeTree,
    history: createMemoryHistory({
      initialEntries: ['/test'],
    }),
  });

  return act(() => renderWithProviders(<RouterProvider router={router} />));
}

test('Hides FeatureRoute as expected', async () => {
  await renderTestRouter(
    <FeatureRoute
      element={<div>Test</div>}
      featureUuid={Scenarios.WITHOUT_FEATURES_KEY}
    />
  );

  expect(screen.getByText(/home/i)).toBeInTheDocument();
});

test('Shows FeatureRoute as expected', async () => {
  await renderTestRouter(
    <FeatureRoute
      element={<div>Test</div>}
      featureUuid={Scenarios.WITH_FEATURES_KEY}
      showIfIsLoading
    />
  );

  expect(screen.getByText(/test/i)).toBeInTheDocument();
});

test('Shows fallback as expected', async () => {
  await renderTestRouter(
    <FeatureRoute
      element={<div>Test</div>}
      fallback={<div>Fallback</div>}
      featureUuid={Scenarios.WITHOUT_FEATURES_KEY}
    />
  );

  expect(screen.getByText(/fallback/i)).toBeInTheDocument();
});

test('Redirects to set path', async () => {
  await renderTestRouter(
    <FeatureRoute
      element={<div>Test</div>}
      redirectPath="/other"
      featureUuid={Scenarios.WITHOUT_FEATURES_KEY}
    />
  );

  expect(screen.getByText(/other/i)).toBeInTheDocument();
});

import { ReactNode } from 'react';

import { faker } from '@faker-js/faker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useFeatureToggleContext } from '../providers/FeatureToggleProvider';
import { renderHook, waitFor } from '../tests/test-utils';
import { useFeatureToggling } from './useFeatureToggling';
import { CancelablePromise } from 'src/api';
import { FeatureToggleProvider } from 'src/providers';
import { EnvironmentType } from 'src/types';

const ENVIRONMENT = EnvironmentType.STAGING;
const uniqueFeatureKey = faker.database.mongodbObjectId();
enum Scenarios {
  WITH_FEATURES_KEY = 'withFeatures',
  WITHOUT_FEATURES_KEY = 'withoutFeatures',
  WHITELISTED_USER = 'whitelistedUser',
  WRONG_WHITELISTED_USER = 'wrongWhitelistedUser',
}

const username = faker.internet.userName();
const mockedAppFeatures = [
  {
    applicationName: Scenarios.WITH_FEATURES_KEY,
    features: [
      {
        featureKey: uniqueFeatureKey,
        activeEnvironments: [ENVIRONMENT],
        activeUsers: [{ mail: username }],
        uuid: '',
        description: '',
      },
    ],
  },
  {
    applicationName: Scenarios.WHITELISTED_USER,
    features: [
      {
        featureKey: uniqueFeatureKey,
        activeEnvironments: [ENVIRONMENT],
        activeUsers: [{ mail: username }],
        uuid: '',
        description: '',
      },
    ],
  },
  {
    applicationName: Scenarios.WRONG_WHITELISTED_USER,
    features: [
      {
        featureKey: uniqueFeatureKey,
        activeEnvironments: [ENVIRONMENT],
        activeUsers: [{ mail: 'otherMockedUser@euquinor.com' }],
        uuid: '',
        description: '',
      },
    ],
  },
  {
    applicationName: Scenarios.WITHOUT_FEATURES_KEY,
    features: [],
  },
];

let mockServiceHasError = false;

vi.mock('src/api/services/PortalService', () => {
  class PortalService {
    public static getFeatureToggleFromApplicationName(
      key: Scenarios
    ): CancelablePromise<unknown> {
      return new CancelablePromise((resolve, reject) => {
        setTimeout(() => {
          if (mockServiceHasError) {
            reject( 'error featureToggle');
          } else {
            resolve(mockedAppFeatures.find((f) => f.applicationName === key));
          }
        }, 300);
      });
    }
  }
  return { PortalService };
});

function Wrappers({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <FeatureToggleProvider>{children}</FeatureToggleProvider>
    </QueryClientProvider>
  );
}
function WrappersWithoutFeatureToggleProvider({
  children,
}: {
  children: ReactNode;
}) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

test('should return true for showContent when there is a feature and it is matching the environment we are in', async () => {
  vi.stubEnv('VITE_NAME', Scenarios.WITH_FEATURES_KEY);
  vi.stubEnv('VITE_ENVIRONMENT_NAME', ENVIRONMENT);
  const { result } = renderHook(
    () => useFeatureToggling({ featureKey: uniqueFeatureKey, username }),
    {
      wrapper: Wrappers,
    }
  );

  await waitFor(
    () => {
      expect(result.current.showContent).toBe(true);
    },
    { timeout: 600 }
  );
});

test('should return false for showContent when there is a feature but it does not match the environment we are in', async () => {
  vi.stubEnv('VITE_NAME', Scenarios.WITH_FEATURES_KEY);
  vi.stubEnv('VITE_ENVIRONMENT_NAME', faker.animal.dog());
  const { result } = renderHook(
    () => useFeatureToggling({ featureKey: uniqueFeatureKey }),
    {
      wrapper: Wrappers,
    }
  );

  await waitFor(
    () => {
      expect(result.current.showContent).toBe(false);
    },
    { timeout: 600 }
  );
});

test('should return true for showContent feature is not found', async () => {
  vi.stubEnv('VITE_NAME', Scenarios.WITH_FEATURES_KEY);
  vi.stubEnv('VITE_ENVIRONMENT_NAME', ENVIRONMENT);
  const consoleWarnSpy = vi.spyOn(console, 'warn');
  const { result } = renderHook(
    () => useFeatureToggling({ featureKey: faker.animal.bird() }),
    {
      wrapper: Wrappers,
    }
  );

  await waitFor(
    () => {
      expect(result.current.showContent).toBe(true);
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
    },
    { timeout: 600 }
  );
});

test('should return true for showContent when there is a feature and we have a whitelisted user, but not matching the environment we are in', async () => {
  vi.stubEnv('VITE_NAME', Scenarios.WHITELISTED_USER);
  vi.stubEnv('VITE_ENVIRONMENT_NAME', faker.animal.dog());
  const consoleWarnSpy = vi.spyOn(console, 'warn');
  const { result } = renderHook(
    () =>
      useFeatureToggling({
        featureKey: uniqueFeatureKey,
        username,
        showIfKeyIsMissing: false,
      }),
    {
      wrapper: Wrappers,
    }
  );

  await waitFor(
    () => {
      expect(result.current.showContent).toBe(true);
      expect(consoleWarnSpy).toHaveBeenCalled()
    },
    { timeout: 600 }
  );
});

test('should return false for showContent when there is a feature, but not matching the environment or the whitelisted user', async () => {
  vi.stubEnv('VITE_NAME', Scenarios.WRONG_WHITELISTED_USER);
  vi.stubEnv('VITE_ENVIRONMENT_NAME', faker.animal.dog());
  const { result } = renderHook(
    () => useFeatureToggling({ featureKey: uniqueFeatureKey, username }),
    {
      wrapper: Wrappers,
    }
  );

  await waitFor(
    () => {
      expect(result.current.showContent).toBe(false);
    },
    { timeout: 600 }
  );
});

test('should return false for showContent when there is no feature, and "showIfKeyMissing" is set to false', async () => {
  vi.stubEnv('VITE_NAME', Scenarios.WITHOUT_FEATURES_KEY);
  vi.stubEnv('VITE_ENVIRONMENT_NAME', faker.animal.dog());
  const { result } = renderHook(
    () =>
      useFeatureToggling({
        featureKey: uniqueFeatureKey,
        showIfKeyIsMissing: false,
      }),
    {
      wrapper: Wrappers,
    }
  );

  await waitFor(
    () => {
      expect(result.current.showContent).toBe(false);
    },
    { timeout: 600 }
  );
});

test('should return false if is loading', async () => {
  mockServiceHasError = false;
  vi.stubEnv('VITE_NAME', Scenarios.WITH_FEATURES_KEY);
  vi.stubEnv('VITE_ENVIRONMENT_NAME', ENVIRONMENT);
  const { result } = renderHook(
    () => useFeatureToggling({ featureKey: uniqueFeatureKey }),
    {
      wrapper: Wrappers,
    }
  );
  await waitFor(
      () => {
        expect(result.current.showContent).toBe(false);
      },
      { timeout: 1000 }
  );
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await waitFor(
    () => {
      expect(result.current.showContent).toBe(true);
    },
    { timeout: 1000 }
  );
}, 10000);

test('should return true if is loading and showIfIsLoading=true', async () => {
  mockServiceHasError = false;
  vi.stubEnv('VITE_NAME', Scenarios.WITH_FEATURES_KEY);
  vi.stubEnv('VITE_ENVIRONMENT_NAME', ENVIRONMENT);
  const { result } = renderHook(
      () => useFeatureToggling({ featureKey: uniqueFeatureKey, showIfIsLoading: true}),
      {
        wrapper: Wrappers,
      }
  );
  await waitFor(
      () => {
        expect(result.current.showContent).toBe(true);
      },
      { timeout: 1000 }
  );
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await waitFor(
      () => {
        expect(result.current.showContent).toBe(true);
      },
      { timeout: 1000 }
  );
}, 10000);

test('should return false if error request has error', async () => {
  mockServiceHasError = true;
  vi.stubEnv('VITE_NAME', Scenarios.WITH_FEATURES_KEY);
  vi.stubEnv('VITE_ENVIRONMENT_NAME', ENVIRONMENT);
  const { result } = renderHook(
      () => useFeatureToggling({ featureKey: uniqueFeatureKey }),
      {
        wrapper: Wrappers,
      }
  );
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await waitFor(
      () => {
        expect(result.current.showContent).toBe(false);
      },
      { timeout: 6000 }
  );
}, 10000);

test('useFeatureToggleContext throws error when used outside context', () => {
  console.error = vi.fn();
  expect(() => {
    renderHook(() => useFeatureToggleContext(), {
      wrapper: WrappersWithoutFeatureToggleProvider,
    });
  }).toThrow("'useFeatureToggleContext' must be used within provider");
});

test("shows warning when feature has activeUsers but username isn't defined", async () => {
  mockServiceHasError = false;
  console.warn = vi.fn();
  vi.stubEnv('VITE_NAME', Scenarios.WRONG_WHITELISTED_USER);
  vi.stubEnv('VITE_ENVIRONMENT_NAME', faker.animal.dog());
  renderHook(
    () =>
      useFeatureToggling({
        featureKey: uniqueFeatureKey,
        username: undefined,
      }),
    {
      wrapper: Wrappers,
    }
  );

  await waitFor(() => expect(console.warn).toHaveBeenCalled());
});

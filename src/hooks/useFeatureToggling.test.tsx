import { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useFeatureToggleContext } from '../providers/FeatureToggleProvider';
import { renderHook, waitFor } from '../tests/test-utils';
import { useFeatureToggling } from './useFeatureToggling';
import { CancelablePromise } from 'src/api';
import { FeatureToggleProvider } from 'src/providers';

enum Scenarios {
  WITH_FEATURES_KEY = 'withFeatures',
  WITH_FEATURES_KEY_BUT_INACTIVE = 'withFeaturesInactive',
  WITHOUT_FEATURES_KEY = 'withoutFeatures',
}

vi.mock('src/api/services/FeatureToggleService', () => {
  class FeatureToggleService {
    public static getMyFeatures(): CancelablePromise<unknown> {
      return new CancelablePromise((resolve) => {
        setTimeout(() => {
          resolve([
            { uuid: Scenarios.WITH_FEATURES_KEY, active: true },
            { uuid: Scenarios.WITH_FEATURES_KEY_BUT_INACTIVE, active: false },
          ]);
        }, 300);
      });
    }
  }
  return { FeatureToggleService };
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

test('should return true for showContent when it is active in "myFeatures"', async () => {
  const { result } = renderHook(
    () => useFeatureToggling({ featureUuid: Scenarios.WITH_FEATURES_KEY }),
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

test('should return true for showContent when active = false in "myFeatures"', async () => {
  const { result } = renderHook(
    () =>
      useFeatureToggling({
        featureUuid: Scenarios.WITH_FEATURES_KEY_BUT_INACTIVE,
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

test('Using string as param works as expected', async () => {
  const { result } = renderHook(
    () => useFeatureToggling(Scenarios.WITH_FEATURES_KEY),
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

test('should return false for showContent when uuid isnt in myFeatures', async () => {
  const { result } = renderHook(
    () => useFeatureToggling({ featureUuid: Scenarios.WITHOUT_FEATURES_KEY }),
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
  const { result } = renderHook(
    () => useFeatureToggling({ featureUuid: Scenarios.WITH_FEATURES_KEY }),
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
  const { result } = renderHook(
    () =>
      useFeatureToggling({
        featureUuid: Scenarios.WITH_FEATURES_KEY,
        showIfIsLoading: true,
      }),
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

test('useFeatureToggleContext throws error when used outside context', () => {
  console.error = vi.fn();
  expect(() => {
    renderHook(() => useFeatureToggleContext(), {
      wrapper: WrappersWithoutFeatureToggleProvider,
    });
  }).toThrow("'useFeatureToggleContext' must be used within provider");
});

test('Should show console warning if feature is not found', async () => {
  const spy = vi.spyOn(console, 'warn');

  renderHook(
    () =>
      useFeatureToggling({
        featureUuid: Scenarios.WITHOUT_FEATURES_KEY,
      }),
    {
      wrapper: Wrappers,
    }
  );
  await waitFor(
    () => {
      expect(spy).toHaveBeenCalledOnce();
    },
    { timeout: 1000 }
  );
});

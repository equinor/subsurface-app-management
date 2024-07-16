import { faker } from '@faker-js/faker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';

import { CancelablePromise } from 'src/api';
import {
  FeatureToggleProvider,
  useFeatureToggleContext,
} from 'src/providers/FeatureToggleProvider';
import { EnvironmentType } from 'src/types';

vi.mock('src/api/services/PortalService', () => {
  class PortalService {
    public static getFeatureToggleFromApplicationName(): CancelablePromise<unknown> {
      return new CancelablePromise((resolve) => {
        setTimeout(() => {
          resolve([]);
        }, 300);
      });
    }
  }
  return { PortalService };
});

test('Overrides work as expected', () => {
  const appName = faker.animal.lion();
  const environmentName = 'production';
  const { result } = renderHook(() => useFeatureToggleContext(), {
    wrapper: ({ children }) => {
      const queryClient = new QueryClient();
      return (
        <QueryClientProvider client={queryClient}>
          <FeatureToggleProvider
            overrideAppName={appName}
            overrideEnvironment={environmentName as EnvironmentType}
          >
            {children}
          </FeatureToggleProvider>
        </QueryClientProvider>
      );
    },
  });

  expect(result.current?.environmentName).toBe(environmentName);
});

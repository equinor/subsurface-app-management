import { faker } from '@faker-js/faker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';

import { CancelablePromise, MyFeatureDto } from 'src/api';
import {
  FeatureToggleProvider,
  useFeatureToggleContext,
} from 'src/providers/FeatureToggleProvider';
import { EnvironmentType } from 'src/types';

vi.mock('src/api', () => {
  class FeatureToggleService {
    public static getMyFeatures(
      appName: string,
      env: string
    ): CancelablePromise<MyFeatureDto[]> {
      return new CancelablePromise((resolve) => {
        setTimeout(() => {
          if (env === 'production') {
            resolve([
              {
                uuid: 'prod-uuid',
              },
            ]);
          }
          resolve([]);
        }, 300);
      });
    }
  }
  return { FeatureToggleService };
});

test('Overrides work as expected', async () => {
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

  expect(result.current.isLoading).toBeTruthy();
});

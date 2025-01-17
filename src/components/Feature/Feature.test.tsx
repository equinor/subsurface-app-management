import { ReactNode } from 'react';

import { faker } from '@faker-js/faker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { waitFor } from '@testing-library/react';

import { CancelablePromise } from 'src/api';
import { Feature } from 'src/components/Feature/Feature';
import { FeatureToggleProvider } from 'src/providers';
import { render, screen } from 'src/tests/test-utils';

import { beforeEach, describe } from 'vitest';

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

function Wrappers({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <FeatureToggleProvider>{children}</FeatureToggleProvider>
    </QueryClientProvider>
  );
}
describe('Feature toggle component', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_IS_MOCK', 'true');
  });

  test('Shows content when it feature = true', async () => {
    vi.stubEnv('VITE_NAME', Scenarios.WITH_FEATURES_KEY);
    const randomString = faker.animal.fish();
    render(
      <Feature featureUuid={Scenarios.WITH_FEATURES_KEY}>
        <p>{randomString}</p>
      </Feature>,
      { wrapper: Wrappers }
    );

    const element = await waitFor(() => screen.getByText(randomString));

    expect(element).toBeInTheDocument();
  });

  test('Shows content when it feature = false', async () => {
    vi.stubEnv('VITE_NAME', Scenarios.WITH_FEATURES_KEY);
    const randomString = faker.animal.fish();
    render(
      <Feature featureUuid={Scenarios.WITHOUT_FEATURES_KEY}>
        <p>{randomString}</p>
      </Feature>,
      { wrapper: Wrappers }
    );

    const element = await waitFor(() => screen.queryByText(randomString));

    expect(element).not.toBeInTheDocument();
  });
});

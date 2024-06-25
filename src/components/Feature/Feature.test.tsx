import { ReactNode } from 'react';

import { faker } from '@faker-js/faker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { waitFor } from '@testing-library/react';

import { CancelablePromise } from 'src/api';
import { Feature } from 'src/components/Feature/Feature';
import { AuthProvider, FeatureToggleProvider } from 'src/providers';
import { render, screen } from 'src/tests/test-utils';

import { beforeEach, describe } from 'vitest';

const ENVIRONMENT = 'test';
const uniqueFeatureKey = faker.database.mongodbObjectId();
enum Scenarios {
  WITH_FEATURES_KEY = 'withFeatures',
  WITHOUT_FEATURES_KEY = 'withoutFeatures',
}
const mockedAppFeatures = [
  {
    applicationName: Scenarios.WITH_FEATURES_KEY,
    features: [
      {
        featureKey: uniqueFeatureKey,
        activeEnvironments: [ENVIRONMENT],
        activeUsers: [],
        uuid: '',
        description: '',
      },
    ],
  },
  { applicationName: Scenarios.WITHOUT_FEATURES_KEY, features: [] },
];
vi.mock('src/api/services/PortalService', () => {
  class PortalService {
    public static getFeatureToggleFromApplicationName(
      key: Scenarios
    ): CancelablePromise<unknown> {
      return new CancelablePromise((resolve) => {
        setTimeout(() => {
          resolve(mockedAppFeatures.find((f) => f.applicationName === key));
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
      <AuthProvider>
        <FeatureToggleProvider>{children}</FeatureToggleProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
describe('Feature toggle component', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_ENVIRONMENT_NAME', ENVIRONMENT);
    vi.stubEnv('VITE_IS_MOCK', 'true');
  });

  test('Shows content when it feature = true', async () => {
    vi.stubEnv('VITE_NAME', Scenarios.WITH_FEATURES_KEY);
    const randomString = faker.animal.fish();
    render(
      <Feature featureKey={Scenarios.WITH_FEATURES_KEY}>
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
      <Feature featureKey={Scenarios.WITHOUT_FEATURES_KEY}>
        <p>{randomString}</p>
      </Feature>,
      { wrapper: Wrappers }
    );

    const element = await waitFor(() => screen.queryByText(randomString));

    expect(element).not.toBeInTheDocument();
  });
});

import { ReactNode } from 'react';

import { faker } from '@faker-js/faker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import { useReleaseNotesQuery } from './useReleaseNotesQuery';
import { CancelablePromise, ReleaseNote } from 'src/api';

vi.mock('src/api/services/ReleaseNotesService', () => {
  class ReleaseNotesService {
    public static getReleasenoteList(
      appName: string
    ): CancelablePromise<ReleaseNote[]> {
      return new CancelablePromise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              releaseId: faker.string.uuid(),
              applicationName: appName,
            },
          ]);
        }, 100);
      });
    }
  }
  return { ReleaseNotesService };
});

function Wrappers({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

test('Returns list of release notes as expected', async () => {
  const { result } = renderHook(() => useReleaseNotesQuery(), {
    wrapper: Wrappers,
  });

  await waitFor(() => expect(result.current.data).toBeDefined());
  await waitFor(() => expect(result.current.data).toHaveLength(1));
});

test('Override enabled works as expected', async () => {
  const { result } = renderHook(
    () => useReleaseNotesQuery({ enabled: false }),
    {
      wrapper: Wrappers,
    }
  );

  await waitFor(() => expect(result.current.data).not.toBeDefined());
});

test('Override app name work as expected', async () => {
  const override = faker.person.fullName();
  const { result } = renderHook(
    () => useReleaseNotesQuery({ overrideAppName: override }),
    {
      wrapper: Wrappers,
    }
  );

  await waitFor(() => expect(result.current.data).toBeDefined());
  await waitFor(() => expect(result.current.data).toHaveLength(1));
  await waitFor(() =>
    expect(result.current.data?.[0].applicationName).toBe(override)
  );
});

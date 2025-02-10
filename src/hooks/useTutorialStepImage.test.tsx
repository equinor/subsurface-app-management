import { ReactNode } from 'react';

import { faker } from '@faker-js/faker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import { CancelablePromise } from 'src/api';
import { useTutorialStepImage } from 'src/hooks/useTutorialStepImage';

vi.mock('src/api/services/TutorialService', () => {
  class TutorialService {
    public static getTutorialImage(path: string) {
      return new CancelablePromise((resolve) => {
        setTimeout(() => {
          resolve(path);
        }, 100);
      });
    }
  }

  return { TutorialService };
});

function Wrappers({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

test('Returns expected image', async () => {
  const randomPath = faker.animal.dog();

  const { result } = renderHook(() => useTutorialStepImage(randomPath), {
    wrapper: Wrappers,
  });

  await waitFor(() => expect(result.current.data).toBe(randomPath));
});

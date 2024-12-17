import { FC, ReactElement, ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FeatureToggleProvider } from 'src/providers';

const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <FeatureToggleProvider>{children}</FeatureToggleProvider>
    </QueryClientProvider>
  );
};

const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: Providers, ...options });

const customRender = (
  ui: ReactElement,
  options?: RenderOptions
): ReturnType<typeof render> => render(ui, options);

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render, renderWithProviders, userEvent };

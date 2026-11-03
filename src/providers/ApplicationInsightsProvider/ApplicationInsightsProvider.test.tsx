import { act, render } from '@testing-library/react';

import { ApplicationInsightsProvider } from 'src/providers/ApplicationInsightsProvider/ApplicationInsightsProvider';
import {
  samClearAuthenticatedUser,
  samSetAuthenticatedUser,
} from 'src/providers/ApplicationInsightsProvider/ApplicationInsightsProvider.utils';

const {
  trackEvent,
  setAuthenticatedUserContext,
  clearAuthenticatedUserContext,
} = vi.hoisted(() => ({
  trackEvent: vi.fn(),
  setAuthenticatedUserContext: vi.fn(),
  clearAuthenticatedUserContext: vi.fn(),
}));

vi.mock('@microsoft/applicationinsights-web', () => {
  class ApplicationInsights {
    loadAppInsights() {}
    trackEvent = trackEvent;
    setAuthenticatedUserContext = setAuthenticatedUserContext;
    clearAuthenticatedUserContext = clearAuthenticatedUserContext;
  }
  return { ApplicationInsights };
});

vi.mock('src/utils', () => ({
  environment: {
    getApplicationInsightsConnectionString: () => 'connection-string',
  },
}));

beforeEach(() => {
  vi.useFakeTimers();
  trackEvent.mockClear();
});

afterEach(() => {
  vi.useRealTimers();
  document.documentElement.removeAttribute('data-theme');
});

test('Tracks theme from data-theme on mount and when it changes', async () => {
  document.documentElement.setAttribute('data-theme', 'light');

  render(
    <ApplicationInsightsProvider>
      <p>child</p>
    </ApplicationInsightsProvider>
  );

  act(() => vi.advanceTimersByTime(5000));
  expect(trackEvent).toHaveBeenCalledWith({
    name: 'Theme',
    properties: { Theme: 'light' },
  });

  document.documentElement.setAttribute('data-theme', 'dark');
  // Let the MutationObserver callback run
  await act(async () => {
    await Promise.resolve();
  });
  act(() => vi.advanceTimersByTime(5000));

  expect(trackEvent).toHaveBeenLastCalledWith({
    name: 'Theme',
    properties: { Theme: 'dark' },
  });
});

test('Keeps the signed-in user in a cookie for later telemetry until they sign out', () => {
  samSetAuthenticatedUser('ABC@equinor.com');
  expect(setAuthenticatedUserContext).toHaveBeenCalledWith(
    'ABC@equinor.com',
    undefined,
    true
  );

  samClearAuthenticatedUser();
  expect(clearAuthenticatedUserContext).toHaveBeenCalledOnce();
});

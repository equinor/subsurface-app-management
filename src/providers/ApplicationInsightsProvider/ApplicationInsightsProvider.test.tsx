import { act, render } from '@testing-library/react';

import { ApplicationInsightsProvider } from './ApplicationInsightsProvider';

const { trackEvent } = vi.hoisted(() => ({ trackEvent: vi.fn() }));

vi.mock('@microsoft/applicationinsights-web', () => {
  class ApplicationInsights {
    loadAppInsights() {}
    trackEvent = trackEvent;
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

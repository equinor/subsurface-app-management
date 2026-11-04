import {
  ICustomProperties,
  IEventTelemetry,
  IMetricTelemetry,
} from '@microsoft/applicationinsights-web';

import { appInsights } from './ApplicationInsightsProvider';

export function samTrackEvent(
  event: IEventTelemetry,
  customProperties?: ICustomProperties
) {
  if (!appInsights) return;

  appInsights.trackEvent(event, customProperties);
}

export function samTrackMetric(
  metric: IMetricTelemetry,
  customProperties?: ICustomProperties
) {
  if (!appInsights) return;

  appInsights.trackMetric(metric, customProperties);
}

/**
 * Records the signed-in user as `user_AuthenticatedId` on all later browser telemetry, such as page views, so each
 * user is counted once across browsers and devices. The user is kept in a cookie, so page views after a reload are
 * attributed before sign-in completes. Does nothing when Application Insights isn't configured.
 * @param userId - The same ID the app's backend records for the user, e.g. their username. It can't contain commas,
 * semicolons, equals signs, spaces or vertical bars.
 */
export function samSetAuthenticatedUser(userId: string) {
  appInsights?.setAuthenticatedUserContext(userId, undefined, true);
}

/**
 * Stops recording the signed-in user on browser telemetry, e.g. when they sign out, so later telemetry in the same
 * browser isn't attributed to them. Does nothing when Application Insights isn't configured.
 */
export function samClearAuthenticatedUser() {
  appInsights?.clearAuthenticatedUserContext();
}

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
  if (!appInsights) {
    console.warn(
      '[SAM]: ApplicationInsightsProvider - "appInsights" is undefined, did you set APPLICATION_INSIGHTS_CONNECTION_STRING?'
    );
    return;
  }
  appInsights.trackEvent(event, customProperties);
}

export function samTrackMetric(
  metric: IMetricTelemetry,
  customProperties?: ICustomProperties
) {
  if (!appInsights) {
    console.warn(
      '[SAM]: ApplicationInsightsProvider - "appInsights" is undefined, did you set APPLICATION_INSIGHTS_CONNECTION_STRING?'
    );
    return;
  }
  appInsights.trackMetric(metric, customProperties);
}

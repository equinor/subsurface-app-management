import { FC, ReactNode, useEffect } from 'react';

import {
  ClickAnalyticsPlugin,
  IClickAnalyticsConfiguration,
} from '@microsoft/applicationinsights-clickanalytics-js';
import {
  AppInsightsContext,
  ReactPlugin,
} from '@microsoft/applicationinsights-react-js';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

import { environment } from 'src/utils';

import debounce from 'lodash/debounce';

const reactPlugin = new ReactPlugin();

// *** Add the Click Analytics plug-in. ***
const clickPluginInstance = new ClickAnalyticsPlugin();
const clickPluginConfig: IClickAnalyticsConfiguration = {
  autoCapture: true,
  dropInvalidEvents: true,
};

const INACTIVITY_MS = 1000 * 60 * 20;

const APPLICATION_INSIGHTS_CONNECTION_STRING =
  environment.getApplicationInsightsConnectionString(
    import.meta.env.VITE_APPLICATION_INSIGHTS_CONNECTION_STRING
  );

export const appInsights = APPLICATION_INSIGHTS_CONNECTION_STRING
  ? new ApplicationInsights({
      config: {
        connectionString: APPLICATION_INSIGHTS_CONNECTION_STRING,
        extensions: [reactPlugin, clickPluginInstance],
        extensionConfig: {
          // *** Add the Click Analytics plug-in. ***
          [clickPluginInstance.identifier]: clickPluginConfig,
        },
        autoTrackPageVisitTime: true,
        enableAutoRouteTracking: true,
        sessionRenewalMs: INACTIVITY_MS,
        sessionExpirationMs: INACTIVITY_MS,
      },
    })
  : undefined;

appInsights?.loadAppInsights();

const handleCollectScreenSize = debounce(() => {
  if (!appInsights) {
    console.warn(
      '[SAM]: ApplicationInsightsProvider - "appInsights" is undefined, did you set APPLICATION_INSIGHTS_CONNECTION_STRING?'
    );
    return;
  }

  appInsights.trackEvent({
    name: 'Resolution',
    properties: {
      'Window Resolution': window.innerWidth + 'x' + window.innerHeight,
      'Screen Resolution': screen.width + 'x' + screen.height,
    },
  });
}, 5000); // 5s debounce,

interface ApplicationInsightsProviderProps {
  children: ReactNode;
}

export const ApplicationInsightsProvider: FC<
  ApplicationInsightsProviderProps
> = ({ children }) => {
  useEffect(() => {
    window.addEventListener('load', handleCollectScreenSize);
    window.addEventListener('resize', handleCollectScreenSize);

    return () => {
      window.removeEventListener('resize', handleCollectScreenSize);
      window.removeEventListener('load', handleCollectScreenSize);
    };
  }, []);

  return (
    <AppInsightsContext.Provider value={reactPlugin}>
      {children}
    </AppInsightsContext.Provider>
  );
};

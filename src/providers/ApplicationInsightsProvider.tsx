import { FC, ReactNode, useCallback, useEffect, useRef } from 'react';

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

import { debounce } from 'lodash';

const reactPlugin = new ReactPlugin();

// *** Add the Click Analytics plug-in. ***
const clickPluginInstance = new ClickAnalyticsPlugin();
const clickPluginConfig: IClickAnalyticsConfiguration = {
  autoCapture: true,
  dropInvalidEvents: true,
};

const INACTIVITY_MS = 1000 * 60 * 20;

interface ApplicationInsightsProviderProps {
  children: ReactNode;
}

export const ApplicationInsightsProvider: FC<
  ApplicationInsightsProviderProps
> = ({ children }) => {
  // This needs to be inside the component for the env variable to be loaded as expected
  const appInsights = useRef(
    new ApplicationInsights({
      config: {
        connectionString: environment.getApplicationInsightsInstrumentationKey(
          import.meta.env.VITE_APPLICATION_INSIGHTS_INSTRUMENTATION_KEY
        ),
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
  );
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      appInsights.current.loadAppInsights();
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleCollectScreenSize = useCallback(
    debounce(() => {
      appInsights.current.trackEvent({
        name: 'Resolution',
        properties: {
          'Window Resolution': window.innerWidth + 'x' + window.innerHeight,
          'Screen Resolution': screen.width + 'x' + screen.height,
        },
      });
    }, 5000),
    []
  ); // 5s debounce,

  useEffect(() => {
    window.addEventListener('load', handleCollectScreenSize);
    window.addEventListener('resize', handleCollectScreenSize);

    return () => {
      window.removeEventListener('resize', handleCollectScreenSize);
      window.removeEventListener('load', handleCollectScreenSize);
    };
  }, [handleCollectScreenSize]);

  return (
    <AppInsightsContext value={reactPlugin}>{children}</AppInsightsContext>
  );
};

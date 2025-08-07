import { FC, ReactNode } from 'react';

import { Navigate } from '@tanstack/react-router';

import {
  useFeatureToggling,
  UseFeatureTogglingOptions,
} from 'src/hooks/useFeatureToggling';

interface CommonFeatureRouteProps extends UseFeatureTogglingOptions {
  element: ReactNode;
  redirectPath?: string;
}

interface FeatureRouteWithFallbackProps extends CommonFeatureRouteProps {
  redirectPath?: undefined;
  fallback: ReactNode;
}

export const FeatureRoute: FC<
  CommonFeatureRouteProps | FeatureRouteWithFallbackProps
> = ({ element, ...props }) => {
  const { showContent } = useFeatureToggling({ ...props });

  if (showContent) {
    return element;
  }

  if ('fallback' in props) {
    return props.fallback;
  }

  const redirectPath =
    'redirectPath' in props && props.redirectPath ? props.redirectPath : '/';

  return <Navigate replace to={redirectPath} />;
};

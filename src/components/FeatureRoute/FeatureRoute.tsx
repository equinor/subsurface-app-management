import { FC, ReactNode } from 'react';
import { Navigate, Route } from 'react-router-dom';

import {
  useFeatureToggling,
  UseFeatureTogglingOptions,
} from 'src/hooks/useFeatureToggling';

interface CommonFeatureRouteProps extends UseFeatureTogglingOptions {
  path: string;
  element: ReactNode;
  redirectPath?: string;
}

interface FeatureRouteWithFallbackProps extends CommonFeatureRouteProps {
  redirectPath?: undefined;
  fallback: ReactNode;
}

export const FeatureRoute: FC<
  CommonFeatureRouteProps | FeatureRouteWithFallbackProps
> = ({ path, element, ...props }) => {
  const { showContent } = useFeatureToggling({ ...props });

  if (showContent) {
    return <Route path={path} element={element} />;
  }

  if ('fallback' in props) {
    return <Route path={path} element={props.fallback} />;
  }

  const redirectPath =
    'redirectPath' in props && props.redirectPath ? props.redirectPath : '/';

  return <Route path={path} element={<Navigate replace to={redirectPath} />} />;
};

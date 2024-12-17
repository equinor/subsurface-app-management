import { FC, ReactNode } from 'react';

import { useFeatureToggling } from 'src/hooks';
import { UseFeatureTogglingOptions } from 'src/hooks/useFeatureToggling';

interface FeatureProps extends UseFeatureTogglingOptions {
  children: ReactNode;
  fallback?: ReactNode;
}

export const Feature: FC<FeatureProps> = ({ children, fallback, ...rest }) => {
  const { showContent } = useFeatureToggling({
    ...rest,
  });

  if (showContent) {
    return <>{children}</>;
  }

  if (fallback === undefined) return null;

  return <>{fallback}</>;
};

import { DetailedHTMLProps, FC, HTMLAttributes, ReactNode } from 'react';

import { useFeatureToggling } from 'src/hooks';

interface FeatureProps {
  featureKey: string;
  children: ReactNode;
  fallback?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
  showIfKeyIsMissing?: boolean;
}

export const Feature: FC<FeatureProps> = ({
  featureKey,
  children,
  fallback,
  showIfKeyIsMissing = true,
}) => {
  const { showContent } = useFeatureToggling({
    featureKey,
    showIfKeyIsMissing,
  });

  if (showContent) {
    return <>{children}</>;
  }

  return <>{fallback ?? null}</>;
};

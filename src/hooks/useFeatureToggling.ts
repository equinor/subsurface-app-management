import { useMemo } from 'react';

import { useFeatureToggleContext } from '../providers/FeatureToggleProvider';

export interface UseFeatureTogglingOptions {
  featureUuid: string;
  showIfKeyIsMissing?: boolean;
  showIfIsLoading?: boolean;
}

/**
 * @param featureUuid - The uuid of the feature-toggle
 * @param showIfKeyIsMissing - Show/hide if the key was not found/has been deleted. Defaults to true
 * @param ShowIfIsLoading - Show/hide if the feature toggles are still loading. Defaults to false
 */
export function useFeatureToggling(params: UseFeatureTogglingOptions | string) {
  const {
    featureUuid,
    showIfKeyIsMissing = true,
    showIfIsLoading = false,
  } = typeof params === 'string' ? { featureUuid: params } : params;
  const { features, isError, isLoading } = useFeatureToggleContext();

  if (!showIfKeyIsMissing) {
    console.warn(
      `[FeatureToggle] Feature: ${featureUuid} will not show when the feature toggle is removed! Was this intentional?`
    );
  }

  const showContent = useMemo(() => {
    if ((!showIfIsLoading && isLoading) || isError) return false;

    const found = features?.find((feature) => feature.uuid === featureUuid);

    if (found) return found.active;

    return showIfKeyIsMissing;
  }, [
    showIfIsLoading,
    isLoading,
    isError,
    features,
    showIfKeyIsMissing,
    featureUuid,
  ]);

  return { showContent };
}

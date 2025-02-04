import { useMemo } from 'react';

import { useFeatureToggleContext } from '../providers/FeatureToggleProvider';

export interface UseFeatureTogglingOptions {
  featureUuid: string;
  showIfIsLoading?: boolean;
}

/**
 * @param featureUuid - The uuid of the feature-toggle
 * @param showIfIsLoading - Show/hide if the feature toggles are still loading. Defaults to false
 */
export function useFeatureToggling(params: UseFeatureTogglingOptions | string) {
  const { featureUuid, showIfIsLoading = false } =
    typeof params === 'string' ? { featureUuid: params } : params;
  const { features, isError, isLoading } = useFeatureToggleContext();

  const showContent = useMemo(() => {
    if ((!showIfIsLoading && isLoading) || isError) return false;

    const found = features?.find((feature) => feature.uuid === featureUuid);

    if (found) return found.active;

    // Default to show if feature is not found, i.e. has been deleted
    console.warn(
      `[FeatureToggling]: Feature with uuid ${featureUuid} not found. Defaulting to show.`
    );
    return true;
  }, [showIfIsLoading, isLoading, isError, features, featureUuid]);

  return { showContent };
}

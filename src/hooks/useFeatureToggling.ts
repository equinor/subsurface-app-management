import { useMemo } from 'react';

import {
  isUserInActiveUserArray,
  useFeatureToggleContext,
} from '../providers/FeatureToggleProvider';

interface UseFeatureTogglingOptions {
  featureKey: string;
  username?: string;
  showIfKeyIsMissing?: boolean;
}

export function useFeatureToggling({
  featureKey,
  username,
  showIfKeyIsMissing,
}: UseFeatureTogglingOptions) {
  const fallback = showIfKeyIsMissing ?? true;

  const { features, isError, environmentName } = useFeatureToggleContext();

  const feature = features?.find(
    (feature) => feature.featureKey === featureKey
  );
  const showContent = useMemo(() => {
    if (feature) {
      if (
        username === undefined &&
        feature.activeUsers &&
        feature.activeUsers.length > 0
      ) {
        console.warn(
          `[FeatureToggle] Feature ${feature.featureKey} has activeUsers set but username wasn't provided! Was this intentional?`
        );
      }
      if (isUserInActiveUserArray(username, feature.activeUsers)) {
        return true;
      }
      return feature.activeEnvironments.includes(environmentName);
    }
    if (isError) {
      return false;
    }

    return fallback;
  }, [environmentName, fallback, feature, isError, username]);

  return { showContent };
}

import { useMemo } from 'react';

import {
  isUserInActiveUserArray,
  useFeatureToggleContext,
} from '../providers/FeatureToggleProvider';

interface UseFeatureTogglingOptions {
  featureKey: string;
  username?: string;
  showIfKeyIsMissing?: boolean;
  showIfIsLoading?: boolean;
}

/*
 * @param featureKey - The key of the feature-toggle, for example 'new-dashboard-page'
 * @param username - username to feature toggle on, typically username from azure. Does not need to be provided if not feature-toggling for specific user
 * @param showIfKeyIsMissing - Show/hide if the key was not found/has been deleted. Defaults to true
 * @param ShowIfIsLoading - Show/hide if the feature toggles are still loading. Defaults to false
*/
export function useFeatureToggling({
  featureKey,
  username,
  showIfKeyIsMissing,
}: UseFeatureTogglingOptions) {
  const { features, isError, environmentName, isLoading } = useFeatureToggleContext();
  const fallback = showIfKeyIsMissing ?? true;

  if (!fallback ) {
    console.warn(`[FeatureToggle] Feature: ${featureKey} will not show when the feature toggle is removed! Was this intentional?`)
  }

  const showContent = useMemo(() => {
    if (isLoading) return false

    const feature = features?.find(
        (feature) => feature.featureKey === featureKey
    );

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
    } else {
      console.warn(
          `[FeatureToggle] Feature ${featureKey} was not found, has it been removed?`
      );
    }
    if (isError) {
      return false;
    }

    return fallback;
  }, [environmentName, fallback, features, featureKey, isError, isLoading, username]);

  return { showContent };
}

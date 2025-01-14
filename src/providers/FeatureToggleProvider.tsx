import { createContext, FC, ReactNode, useContext } from 'react';

import { useQuery } from '@tanstack/react-query';

// These 2 api imports need to be separated to be able to use vi.mock in tests
import { MyFeatureDto } from 'src/api';
import { FeatureToggleService } from 'src/api/services/FeatureToggleService';
import { GET_FEATURE_TOGGLES_FOR_APP } from 'src/constants/queryKeys';
import { EnvironmentType } from 'src/types';
import { environment } from 'src/utils';
import { getEnvironmentName } from 'src/utils/environment';

const { getAppName } = environment;

interface FeatureToggleContextType {
  isLoading: boolean;
  isError: boolean;
  features?: MyFeatureDto[] | null;
}

const FeatureToggleContext = createContext<
  FeatureToggleContextType | undefined
>(undefined);

export function useFeatureToggleContext() {
  const context = useContext(FeatureToggleContext);
  if (context === undefined) {
    throw new Error("'useFeatureToggleContext' must be used within provider");
  }
  return context;
}

interface FeatureToggleProviderProps {
  children: ReactNode;
  overrideAppName?: string;
  overrideEnvironment?: EnvironmentType;
}

export const FeatureToggleProvider: FC<FeatureToggleProviderProps> = ({
  children,
  overrideAppName,
  overrideEnvironment,
}) => {
  const applicationName =
    overrideAppName ?? getAppName(import.meta.env.VITE_NAME);
  const environmentName =
    overrideEnvironment ??
    getEnvironmentName(import.meta.env.VITE_ENVIRONMENT_NAME);

  const {
    data: myFeatures = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: [GET_FEATURE_TOGGLES_FOR_APP],
    queryFn: async () =>
      FeatureToggleService.getMyFeatures(applicationName, environmentName),
  });

  return (
    <FeatureToggleContext.Provider
      value={{
        features: myFeatures,
        isLoading,
        isError,
      }}
    >
      {children}
    </FeatureToggleContext.Provider>
  );
};

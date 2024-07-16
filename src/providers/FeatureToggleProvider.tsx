import { createContext, FC, ReactElement, ReactNode, useContext } from 'react';

import { useQuery } from '@tanstack/react-query';

import { FeatureAPIType, FeatureToggleDto, GraphUser } from 'src/api';
import { PortalService } from 'src/api/services/PortalService';
import { EnvironmentType } from 'src/types';
import { environment } from 'src/utils';
import { getEnvironmentName } from 'src/utils/environment';

const { getAppName } = environment;

export const isUserInActiveUserArray = (
  username: string | undefined,
  activeUsers: GraphUser[] | undefined | null
) => {
  if (username && activeUsers && activeUsers.length > 0) {
    return activeUsers
      .map((user) => user.mail.toLowerCase())
      .includes(username.toLowerCase());
  }
  return false;
};

interface FeatureToggleContextType {
  isLoading: boolean;
  isError: boolean;
  environmentName: EnvironmentType;
  features?: FeatureAPIType[] | null;
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
  loadingComponent?: ReactElement;
  overrideAppName?: string;
  overrideEnvironment?: EnvironmentType;
}

export const FeatureToggleProvider: FC<FeatureToggleProviderProps> = ({
  children,
  loadingComponent,
  overrideAppName,
  overrideEnvironment,
}) => {
  const applicationName = overrideAppName
    ? overrideAppName
    : getAppName(import.meta.env.VITE_NAME);
  const environmentName = overrideEnvironment
    ? overrideEnvironment
    : getEnvironmentName(import.meta.env.VITE_ENVIRONMENT_NAME);

  const {
    data: featureToggle,
    isLoading,
    isError,
  } = useQuery<FeatureToggleDto>({
    queryKey: ['getFeatureToggleFromAppName'],
    queryFn: async () =>
      PortalService.getFeatureToggleFromApplicationName(applicationName),
  });

  if (isLoading && loadingComponent) return loadingComponent;

  return (
    <FeatureToggleContext.Provider
      value={{
        features: featureToggle?.features,
        isLoading,
        isError,
        environmentName,
      }}
    >
      {children}
    </FeatureToggleContext.Provider>
  );
};

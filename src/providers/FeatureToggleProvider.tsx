import { createContext, FC, ReactNode, useContext } from 'react';

import { FullPageSpinner } from '@equinor/amplify-components';
import { useQuery } from '@tanstack/react-query';

import { environment } from '../utils';
import { FeatureAPIType, FeatureToggleDto, GraphUser } from 'src/api';
import { PortalService } from 'src/api/services/PortalService';

const { getAppName } = environment;

export const isUserInActiveUserArray = (
  username: string,
  activeUsers: GraphUser[] | undefined | null
) => {
  if (activeUsers && activeUsers.length > 0) {
    return activeUsers
      .map((user) => user.mail.toLowerCase())
      .includes(username.toLowerCase());
  }
  return false;
};

interface FeatureToggleContextType {
  isLoading: boolean;
  isError: boolean;
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
}
const FeatureToggleProvider: FC<FeatureToggleProviderProps> = ({
  children,
}) => {
  const applicationName = getAppName(import.meta.env.VITE_NAME);

  const {
    data: featureToggle,
    isLoading,
    isError,
  } = useQuery<FeatureToggleDto>({
    queryKey: ['getFeatureToggleFromAppName'],
    queryFn: async () =>
      PortalService.getFeatureToggleFromApplicationName(applicationName),
  });

  if (isLoading) return <FullPageSpinner variant="equinor" withoutScrim />;

  return (
    <FeatureToggleContext.Provider
      value={{ features: featureToggle?.features, isLoading, isError }}
    >
      {children}
    </FeatureToggleContext.Provider>
  );
};

export default FeatureToggleProvider;

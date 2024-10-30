import { useContext, useEffect, useState } from 'react';

import { Query, useIsFetching, useQuery } from '@tanstack/react-query';

import { TutorialService } from 'src/api/services/TutorialService';
import {
  GET_TUTORIALS_FOR_APP,
  GET_TUTORIALS_SAS_TOKEN,
} from 'src/constants/queryKeys';
import { TutorialContext } from 'src/providers/TutorialProvider/TutorialProvider';

import { debounce } from 'lodash-es';

export const useGetTutorialsForApp = (appName: string) => {
  return useQuery({
    queryKey: [GET_TUTORIALS_FOR_APP, appName],
    queryFn: () => TutorialService.getTutorialsForApplication(appName),
  });
};

export const useGetTutorialSasToken = () => {
  return useQuery({
    queryKey: [GET_TUTORIALS_SAS_TOKEN],
    queryFn: () => TutorialService.getTutorialSasToken(),
  });
};

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error("'useTutorial' must be used within a TutorialProvider");
  }

  return context;
};

export const useIsFetchingWithTimeout = (
  predicateFn: (query: Query) => boolean
) => {
  const [debouncedIsFetching, setDebouncedIsFetching] = useState(true);

  const appIsFetching = useIsFetching({ predicate: predicateFn }) > 0;

  useEffect(() => {
    debounce(() => {
      setDebouncedIsFetching(appIsFetching);
    }, 100);
  }, [appIsFetching]);

  return debouncedIsFetching || debouncedIsFetching !== appIsFetching;
};

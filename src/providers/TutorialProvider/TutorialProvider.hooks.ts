import { useContext } from 'react';

import { useQuery } from '@tanstack/react-query';

import { TutorialService } from 'src/api/services/TutorialService';
import {
  GET_TUTORIALS_FOR_APP,
  GET_TUTORIALS_SAS_TOKEN,
} from 'src/constants/queryKeys';
import { TutorialContext } from 'src/providers/TutorialProvider/TutorialProvider';

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

import { useQuery } from '@tanstack/react-query';

import { TutorialService } from 'src/api';
import { GET_TUTORIALS_FOR_APP } from 'src/constants';
import { EnvironmentType } from 'src/types';
import { getAppName, getEnvironmentName } from 'src/utils/environment';

export function useTutorialsQuery() {
  return useQuery({
    queryKey: [GET_TUTORIALS_FOR_APP],
    queryFn: async () => {
      if (
        getEnvironmentName(import.meta.env.VITE_ENVIRONMENT_NAME) ===
        EnvironmentType.PRODUCTION
      ) {
        const myTutorials = await TutorialService.getMyTutorialsForApplication(
          getAppName(import.meta.env.VITE_NAME),
          false
        );

        // Change the tutorial ID to the tutorial draft ID if it exists
        return myTutorials.map((tutorial) => ({
          ...tutorial,
          id: tutorial.tutorialDraftId ? tutorial.tutorialDraftId : tutorial.id,
          steps: tutorial.steps.sort((a, b) => {
            const first = a.orderBy ?? 0;
            const second = b.orderBy ?? 0;
            return first - second;
          }),
        }));
      }

      const draftTutorials =
        await TutorialService.getDraftTutorialsForApplication(
          getAppName(import.meta.env.VITE_NAME)
        );

      return draftTutorials.map((tutorial) => ({
        ...tutorial,
        steps: tutorial.steps.sort((a, b) => {
          const first = a.orderBy ?? 0;
          const second = b.orderBy ?? 0;
          return first - second;
        }),
      }));
    },
  });
}

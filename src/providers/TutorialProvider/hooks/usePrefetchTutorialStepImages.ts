import { useEffect, useRef } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { MyTutorialDto } from 'src/api';
import { TutorialService } from 'src/api/services/TutorialService';
import { GET_TUTORIAL_STEP_IMAGE } from 'src/constants';
import { useTutorialsQuery } from 'src/hooks';

export function usePrefetchTutorialStepImages() {
  const { data: tutorials = [] } = useTutorialsQuery();
  const queryClient = useQueryClient();
  const cachedTutorials = useRef<string[]>([]);

  useEffect(() => {
    const handlePrefetchImagesForTutorial = (tutorial: MyTutorialDto) => {
      for (const step of tutorial.steps) {
        if (step.imgUrl) {
          queryClient.prefetchQuery({
            queryKey: [GET_TUTORIAL_STEP_IMAGE, step.imgUrl],
            queryFn: () => TutorialService.getTutorialImage(step.imgUrl!),
            staleTime: Infinity,
            gcTime: Infinity,
          });
        }
      }
    };

    for (const tutorial of tutorials) {
      if (!cachedTutorials.current.includes(tutorial.id)) {
        cachedTutorials.current.push(tutorial.id);
        handlePrefetchImagesForTutorial(tutorial);
      }
    }
  }, [queryClient, tutorials]);
}

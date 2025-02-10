import { useQuery } from '@tanstack/react-query';

import { TutorialService } from 'src/api/services/TutorialService';
import { GET_TUTORIAL_STEP_IMAGE } from 'src/constants/queryKeys';

export function useTutorialStepImage(imgUrl: string | undefined) {
  return useQuery({
    queryKey: [GET_TUTORIAL_STEP_IMAGE, imgUrl],
    queryFn: () => {
      return TutorialService.getTutorialImage(imgUrl!);
    },
    // Assume that images (with the same imgUrl) don't change dynamically
    gcTime: Infinity,
    staleTime: Infinity,
    enabled: imgUrl !== undefined,
  });
}

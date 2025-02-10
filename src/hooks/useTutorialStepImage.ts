import { useQuery } from '@tanstack/react-query';

import { TutorialService } from 'src/api';
import { GET_TUTORIAL_STEP_IMAGE } from 'src/constants/queryKeys';

export function useTutorialStepImage(imgUrl: string | undefined) {
  return useQuery({
    queryKey: [GET_TUTORIAL_STEP_IMAGE, imgUrl],
    queryFn: () => {
      return TutorialService.getTutorialImage(imgUrl!);
    },
    enabled: imgUrl !== undefined,
  });
}

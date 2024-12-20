import { useQuery } from '@tanstack/react-query';

import { ReleaseNotesService } from 'src/api/services/ReleaseNotesService';
import { GET_RELEASE_NOTES } from 'src/constants/queryKeys';
import { environment } from 'src/utils';

const { getAppName } = environment;

interface ReleaseNotesQueryProps {
  enabled?: boolean;
  overrideAppName?: string;
}

export function useReleaseNotesQuery(options?: ReleaseNotesQueryProps) {
  const applicationName =
    options?.overrideAppName ?? getAppName(import.meta.env.VITE_NAME);

  return useQuery({
    queryKey: [GET_RELEASE_NOTES],
    queryFn: () =>
      ReleaseNotesService.getPublishedReleasenotes(applicationName),
    enabled: options?.enabled ?? true,
  });
}

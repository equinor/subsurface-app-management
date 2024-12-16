import { useQuery } from '@tanstack/react-query';

import { ReleaseNote } from 'src/api/models/ReleaseNote';
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

  return useQuery<ReleaseNote[]>({
    queryKey: [GET_RELEASE_NOTES],
    // TODO: Change this endpoint to the one that doesn't return draft notes
    queryFn: () => ReleaseNotesService.getReleasenoteList(applicationName),
    enabled: options?.enabled ?? true,
  });
}

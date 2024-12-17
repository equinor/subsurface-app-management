enum ReleaseNoteType {
  FEATURE = 'Feature',
  IMPROVEMENT = 'Improvement',
  BUG_FIX = 'Bug fix',
}

type ReleaseNoteTypeInformation = Record<ReleaseNoteType, { dotColor: string }>;

const RELEASENOTE_TYPES_INFORMATION: ReleaseNoteTypeInformation = {
  [ReleaseNoteType.FEATURE]: {
    dotColor: '#0084C4',
  },
  [ReleaseNoteType.IMPROVEMENT]: {
    dotColor: '#FF9200',
  },
  [ReleaseNoteType.BUG_FIX]: {
    dotColor: '#EB0000',
  },
};

interface ReleaseNotesTypesProps {
  name: ReleaseNoteType;
  onClick?: () => void;
  active?: boolean;
  showIcon: boolean;
}

export { ReleaseNoteType, RELEASENOTE_TYPES_INFORMATION };
export type { ReleaseNotesTypesProps };

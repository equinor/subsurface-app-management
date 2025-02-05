import { useCallback, useState } from 'react';

import { getAppName } from 'src/utils/environment';

export const SEEN_TUTORIALS_LOCALSTORAGE_KEY = `sam-seen-tutorials-${getAppName(import.meta.env.VITE_NAME)}`;

function initializeSeenTutorials(): string[] {
  const localStorageData = localStorage.getItem(
    SEEN_TUTORIALS_LOCALSTORAGE_KEY
  );
  if (localStorageData) {
    try {
      const parsedData = JSON.parse(localStorageData);

      if (
        !Array.isArray(parsedData) ||
        !parsedData.every((item) => typeof item === 'string')
      ) {
        throw new Error('Invalid seen tutorial data in localStorage');
      }

      return parsedData as string[];
    } catch (e) {
      console.error(e);
    }
  }
  return [];
}
export function useSeenTutorials() {
  const [seenTutorials, setSeenTutorials] = useState(initializeSeenTutorials());

  const handleSetSeenTutorial = useCallback((tutorialId: string) => {
    setSeenTutorials((prev) => {
      const newSeenTutorials = [...prev, tutorialId];
      localStorage.setItem(
        SEEN_TUTORIALS_LOCALSTORAGE_KEY,
        JSON.stringify(newSeenTutorials)
      );
      return newSeenTutorials;
    });
  }, []);

  return [seenTutorials, handleSetSeenTutorial] as const;
}

import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';
import { matchPath, useLocation } from 'react-router';

import { useSeenTutorials } from './useSeenTutorials';
import { MyTutorialDto } from 'src/api/models/MyTutorialDto';
import { useTutorialsQuery } from 'src/hooks';
import { usePrefetchTutorialStepImages } from 'src/providers/TutorialProvider/hooks/usePrefetchTutorialStepImages';

interface TutorialContextType {
  allTutorials: MyTutorialDto[];
  tutorialsOnThisPage: MyTutorialDto[];
  unseenTutorialsOnThisPage: MyTutorialDto[];
  activeTutorial: MyTutorialDto | undefined;
  startTutorial: (tutorialId: string) => void;
  skipTutorial: (tutorialId: string) => void;
  activeStep: number | undefined;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

export const TutorialDataContext = createContext<
  TutorialContextType | undefined
>(undefined);

export function useTutorials() {
  const context = useContext(TutorialDataContext);
  if (context === undefined) {
    throw new Error("'useTutorials' must be used within provider");
  }
  return context;
}

interface TutorialProviderProps {
  children: ReactNode;
}

export const TutorialProvider: FC<TutorialProviderProps> = ({ children }) => {
  const { pathname } = useLocation();
  const { data: tutorials = [] } = useTutorialsQuery();
  const [activeTutorial, setActiveTutorial] = useState<
    MyTutorialDto | undefined
  >(undefined);
  const [activeStep, setActiveStep] = useState<number | undefined>(undefined);
  const [seenTutorials, setSeenTutorial] = useSeenTutorials();
  usePrefetchTutorialStepImages();

  const tutorialsOnThisPage = useMemo(
    () =>
      tutorials?.filter(
        (tutorial) => matchPath(tutorial.path, pathname) !== null
      ),
    [pathname, tutorials]
  );
  const unseenTutorialsOnThisPage = useMemo(
    () =>
      tutorialsOnThisPage?.filter(
        (tutorial) => !seenTutorials.includes(tutorial.id) && tutorial.willPopUp
      ),
    [seenTutorials, tutorialsOnThisPage]
  );

  const handleStartTutorial = (tutorialId: string) => {
    if (!tutorials?.some((tutorial) => tutorialId === tutorial.id)) {
      throw new Error('Tutorial not found');
    }
    setActiveTutorial(tutorials.find((tutorial) => tutorialId === tutorial.id));
    setActiveStep(0);
  };

  const handleSkipTutorial = (tutorialId: string) => {
    if (activeTutorial && activeTutorial.id === tutorialId) {
      setActiveTutorial(undefined);
      setActiveStep(undefined);
    }
    setSeenTutorial(tutorialId);
  };

  const handleOnGoToNextStep = () => {
    if (!activeTutorial) {
      throw new Error('No currently active tutorial!');
    }

    // This check is more of a failsafe and won't ever happen in a real scenario
    /* c8 ignore next 3 */
    if (activeStep === undefined) {
      throw new Error('activeStep is undefined!');
    }

    if (activeStep + 1 >= activeTutorial.steps.length) {
      setSeenTutorial(activeTutorial.id);
      setActiveTutorial(undefined);
      setActiveStep(undefined);
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleGoToPreviousStep = () => {
    if (!activeTutorial) {
      throw new Error('No currently active tutorial!');
    }

    // This check is more of a failsafe and won't ever happen in a real scenario
    /* c8 ignore next 3 */
    if (activeStep === undefined) {
      throw new Error('activeStep is undefined!');
    }

    if (activeStep === 0) {
      setActiveTutorial(undefined);
      setActiveStep(undefined);
    } else {
      setActiveStep(activeStep - 1);
    }
  };

  return (
    <TutorialDataContext.Provider
      value={{
        allTutorials: tutorials,
        tutorialsOnThisPage,
        unseenTutorialsOnThisPage,
        activeTutorial,
        activeStep,
        startTutorial: handleStartTutorial,
        skipTutorial: handleSkipTutorial,
        goToNextStep: handleOnGoToNextStep,
        goToPreviousStep: handleGoToPreviousStep,
      }}
    >
      {children}
    </TutorialDataContext.Provider>
  );
};

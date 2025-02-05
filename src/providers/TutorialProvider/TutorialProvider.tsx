import {
  createContext,
  FC,
  ReactElement,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { matchPath, useLocation } from 'react-router';

import { useSeenTutorials } from './useSeenTutorials';
import { MyTutorialDto } from 'src/api/models/MyTutorialDto';
import { useTutorialsQuery } from 'src/hooks';

interface TutorialContextType {
  allTutorials: MyTutorialDto[];
  tutorialsOnThisPage: MyTutorialDto[];
  unseenTutorialsOnThisPage: MyTutorialDto[];
  activeTutorial: MyTutorialDto | undefined;
  setActiveTutorial: (tutorialId: string) => void;
  skipTutorial: (tutorialId: string) => void;
  activeStep: number | undefined;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

export const TutorialDataContext = createContext<
  TutorialContextType | undefined
>(undefined);

interface TutorialProviderProps {
  children: ReactElement;
}

export const TutorialProvider: FC<TutorialProviderProps> = ({ children }) => {
  const { pathname } = useLocation();
  const { data: tutorials } = useTutorialsQuery();
  const [activeTutorial, setActiveTutorial] = useState<
    MyTutorialDto | undefined
  >(undefined);
  const [activeStep, setActiveStep] = useState<number | undefined>(undefined);
  const [seenTutorials, setSeenTutorial] = useSeenTutorials();

  const tutorialsOnThisPage = useMemo(
    () =>
      tutorials?.filter(
        (tutorial) => matchPath(tutorial.path, pathname) !== null
      ) ?? [],
    [pathname, tutorials]
  );
  const unseenTutorialsOnThisPage = useMemo(
    () =>
      tutorialsOnThisPage?.filter(
        (tutorial) => !seenTutorials.includes(tutorial.id)
      ) ?? [],
    [seenTutorials, tutorialsOnThisPage]
  );

  const handleSetActiveTutorial = (tutorialId: string) => {
    if (!tutorials?.some((tutorial) => tutorialId === tutorial.id)) {
      throw new Error('Tutorial not found');
    }
    setActiveTutorial(tutorials.find((tutorial) => tutorialId === tutorial.id));
  };

  const handleSkipTutorial = (tutorialId: string) => {
    setSeenTutorial(tutorialId);
  };

  const handleOnGoToNextStep = () => {
    if (!activeTutorial) {
      throw new Error('No currently active tutorial!');
    }

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

    if (activeStep === undefined) {
      throw new Error('activeStep is undefined!');
    }

    if (activeStep - 1 < 0) {
      setActiveTutorial(undefined);
      setActiveStep(undefined);
    } else {
      setActiveStep(activeStep - 1);
    }
  };

  useEffect(() => {
    const shouldPopupTutorial = unseenTutorialsOnThisPage?.find(
      (tutorial) => tutorial.willPopUp
    );
    if (shouldPopupTutorial) {
      setActiveTutorial(shouldPopupTutorial);
      setActiveStep(0);
    }
  }, [unseenTutorialsOnThisPage]);

  return (
    <TutorialDataContext.Provider
      value={{
        allTutorials: tutorials || [],
        tutorialsOnThisPage,
        unseenTutorialsOnThisPage,
        activeTutorial,
        activeStep,
        setActiveTutorial: handleSetActiveTutorial,
        skipTutorial: handleSkipTutorial,
        goToNextStep: handleOnGoToNextStep,
        goToPreviousStep: handleGoToPreviousStep,
      }}
    >
      {children}
    </TutorialDataContext.Provider>
  );
};

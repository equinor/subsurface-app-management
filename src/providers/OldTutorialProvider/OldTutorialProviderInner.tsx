import { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router';

import { Button, Typography } from '@equinor/eds-core-react';

import {
  HIGHLIGHT_PADDING,
  TUTORIAL_HIGHLIGHTER_DATATEST_ID,
} from './OldTutorialProvider.const';
import {
  useGetTutorialsForApp,
  useOldTutorial,
} from './OldTutorialProvider.hooks';
import { Highlighter, TutorialErrorDialog } from './OldTutorialProvider.styles';
import { HighlightingInfo } from './OldTutorialProvider.types';
import { Tutorial } from 'src/api';
import OldTutorialDialog from 'src/providers/OldTutorialProvider/OldTutorialDialog';
import { EnvironmentType } from 'src/types/Environment';

const OldTutorialProviderInner: FC = () => {
  const { pathname } = useLocation();
  const {
    activeTutorial,
    setActiveTutorial,
    dialogRef,
    allElementsToHighlight,
    shortNameFromParams,
    tutorialError,
    tutorialsFromProps,
    currentStep,
    viewportWidth,
    setTutorialError,
    clearSearchParam,
    appName,
    environmentName,
  } = useOldTutorial();

  const hasStartedTutorial = useRef(false);
  const { data: tutorialsFromBackend } = useGetTutorialsForApp(appName);

  const appTutorials = useMemo(() => {
    if (
      !tutorialsFromBackend &&
      (!tutorialsFromProps || tutorialsFromProps.length === 0)
    )
      return [];
    const allTutorials = [];
    if (tutorialsFromProps) {
      allTutorials.push(...tutorialsFromProps);
    }
    if (tutorialsFromBackend) {
      allTutorials.push(...tutorialsFromBackend);
    }
    return allTutorials;
  }, [tutorialsFromBackend, tutorialsFromProps]);

  const highlightingInfo: HighlightingInfo | undefined = useMemo(() => {
    if (!allElementsToHighlight || !activeTutorial || !viewportWidth) return;
    const currentElementToHighlight = allElementsToHighlight[currentStep];

    const highlighterBoundingClient =
      currentElementToHighlight.getBoundingClientRect();

    if (currentElementToHighlight) {
      currentElementToHighlight.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
    return {
      top: highlighterBoundingClient.top - HIGHLIGHT_PADDING + window.scrollY,
      left: highlighterBoundingClient.left - HIGHLIGHT_PADDING,
      height: highlighterBoundingClient.height + HIGHLIGHT_PADDING * 2,
      width: highlighterBoundingClient.width + HIGHLIGHT_PADDING * 2,
    };
  }, [activeTutorial, allElementsToHighlight, currentStep, viewportWidth]);

  const tutorialsForPath = useMemo(() => {
    return appTutorials.filter((item) => pathname.includes(item.path));
  }, [appTutorials, pathname]);

  const runTutorial = useCallback(
    (tutorialToRun: Tutorial) => {
      if (hasStartedTutorial.current) return;
      setActiveTutorial(tutorialToRun);
      hasStartedTutorial.current = true;
    },
    [setActiveTutorial]
  );

  useEffect(() => {
    if (!highlightingInfo || dialogRef.current?.open) return;
    dialogRef.current?.showModal();
  }, [dialogRef, highlightingInfo]);

  useEffect(() => {
    if (tutorialsForPath.length < 1) return;

    const tutorialToRunFromParams = tutorialsForPath.find(
      (item) => item.shortName === shortNameFromParams
    );

    const tutorialThatShouldPopUp = tutorialsForPath.find(
      (item) => !window.localStorage.getItem(item.shortName) && item.willPopUp
    );

    if (tutorialToRunFromParams) {
      runTutorial(tutorialToRunFromParams);
    } else if (tutorialThatShouldPopUp) {
      runTutorial(tutorialThatShouldPopUp);
    }
  }, [runTutorial, shortNameFromParams, tutorialsForPath]);

  const handleOnCloseBrokenTutorial = () => {
    clearSearchParam();
    setTutorialError(false);
    setActiveTutorial(undefined);
  };

  // Resets the hasStartedTutorial ref to allow running multiple tutorials consecutively without refreshing the page
  const resetHasStartedTutorial = useCallback(() => {
    hasStartedTutorial.current = false;
  }, []);

  if (
    !activeTutorial?.showInProd &&
    environmentName === EnvironmentType.PRODUCTION
  )
    return null;

  if (!activeTutorial?.willPopUp && !shortNameFromParams) return null;

  // Show error dialog if the user was expecting a tutorial (opened a link that had tutorial name as parameter)
  if (tutorialError && shortNameFromParams) {
    return (
      <TutorialErrorDialog
        open
        isDismissable
        onClose={handleOnCloseBrokenTutorial}
      >
        <Typography>
          There was a problem starting this tutorial. Please report this in
          using the feedback function in the Top Bar.
        </Typography>
        <Button variant="outlined" onClick={handleOnCloseBrokenTutorial}>
          Close
        </Button>
      </TutorialErrorDialog>
    );
  }

  // Show nothing if tutorial has error, but user did not know that a tutorial tried to play (There is a console.error when tutorial error is set to true)
  if (tutorialError) return null;

  return (
    <>
      {highlightingInfo && (
        <Highlighter
          data-testid={TUTORIAL_HIGHLIGHTER_DATATEST_ID}
          style={{
            top: `${highlightingInfo.top}px`,
            left: `${highlightingInfo.left}px`,
            width: `${highlightingInfo.width}px`,
            height: `${highlightingInfo.height}px`,
          }}
        />
      )}
      <OldTutorialDialog resetHasStartedTutorial={resetHasStartedTutorial} />
    </>
  );
};

export default OldTutorialProviderInner;

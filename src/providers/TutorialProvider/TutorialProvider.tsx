import {
  createContext,
  Dispatch,
  FC,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';

import { useIsFetching } from '@tanstack/react-query';

import { TUTORIAL_SEARCH_PARAM_KEY } from './TutorialProvider.const';
import { CustomTutorialComponent } from './TutorialProvider.types';
import { getAllElementsToHighlight } from './TutorialProvider.utils';
import TutorialProviderInner from './TutorialProviderInner';
import { Step, Tutorial } from 'src/api';
import { EnvironmentType } from 'src/types';
import { getAppName, getEnvironmentName } from 'src/utils/environment';

export interface TutorialContextType {
  activeTutorial: Tutorial | undefined;
  setActiveTutorial: Dispatch<SetStateAction<Tutorial | undefined>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  allElementsToHighlight: HTMLElement[] | undefined;
  setAllElementsToHighlight: Dispatch<
    SetStateAction<HTMLElement[] | undefined>
  >;
  customStepComponents: CustomTutorialComponent[] | undefined;
  currentStepObject: Step | undefined;
  isLastStep: boolean;
  dialogRef: MutableRefObject<HTMLDialogElement | null>;
  clearSearchParam: () => void;
  shortNameFromParams: string | undefined;
  setShortNameFromParams: Dispatch<SetStateAction<string | undefined>>;
  tutorialsFromProps: Tutorial[];
  tutorialError: boolean;
  setTutorialError: Dispatch<SetStateAction<boolean>>;
  viewportWidth: number;
  appName: string;
  environmentName: EnvironmentType;
}

export const TutorialContext = createContext<TutorialContextType | undefined>(
  undefined
);

interface TutorialProviderProps {
  children: ReactNode;
  overrideAppName?: string;
  overrideEnvironmentName?: EnvironmentType;
  customStepComponents?: CustomTutorialComponent[];
  tutorials?: Tutorial[];
  ignoredQueryKeys?: string[];
}

/**
 * Tutorial provider expects to be within a QueryClientProvider
 * @param children Expects to wrap the application globally, typically in a providers file with multiple providers
 * @param overrideAppName Overrides the "NAME" env variable, which is used to fetch the relevant tutorials for your app
 * @param overrideEnvironmentName Overrides the "ENVIRONMENT_NAME" env variable, which is used for the possibility to hide tutorials in "production"
 * @param customStepComponents Adds custom steps components with a key that can be used to link it to a step in a tutorial
 * @param tutorials Passing tutorial object directly. This does not replace any tutorials found from API call, but rather is appended to them
 * @param ignoredQueryKeys An array of query keys TutorialProviders will not wait to finish loading before looking for elements to highlight
 * @constructor
 */

export const TutorialProvider: FC<TutorialProviderProps> = ({
  children,
  overrideAppName,
  overrideEnvironmentName,
  customStepComponents,
  tutorials,
  ignoredQueryKeys,
}) => {
  const [activeTutorial, setActiveTutorial] = useState<Tutorial | undefined>(
    undefined
  );

  const [tutorialError, setTutorialError] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [shortNameFromParams, setShortNameFromParams] = useState<
    string | undefined
  >(undefined);
  const [currentStep, setCurrentStep] = useState(0);
  const [allElementsToHighlight, setAllElementsToHighlight] = useState<
    HTMLElement[] | undefined
  >(undefined);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const appIsFetching =
    useIsFetching({
      predicate: (query) => {
        return !ignoredQueryKeys?.some((ignoredKey) =>
          query.queryKey.includes(ignoredKey)
        );
      },
    }) > 0;

  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const appName = overrideAppName ?? getAppName(import.meta.env.VITE_NAME);
  const environmentName =
    overrideEnvironmentName ??
    getEnvironmentName(import.meta.env.VITE_ENVIRONMENT_NAME);

  const currentStepObject = useMemo(() => {
    if (!activeTutorial) return;
    return activeTutorial.steps.at(currentStep);
  }, [activeTutorial, currentStep]);

  const isLastStep = useMemo(() => {
    if (!activeTutorial) return false;
    return currentStep >= activeTutorial?.steps.length - 1;
  }, [activeTutorial, currentStep]);

  const clearSearchParam = useCallback(() => {
    searchParams.delete(TUTORIAL_SEARCH_PARAM_KEY);
    setSearchParams(searchParams);
    setShortNameFromParams(undefined);
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (shortNameFromParams) return;
    const nameFromSearchParam = searchParams.get(TUTORIAL_SEARCH_PARAM_KEY);
    if (nameFromSearchParam) {
      setShortNameFromParams(nameFromSearchParam);
    }
  }, [searchParams, shortNameFromParams]);

  useEffect(() => {
    /* c8 ignore start */
    const setViewportWidthHandler = () => {
      setViewportWidth(window.innerWidth);
    };
    /* c8 ignore end */

    window.addEventListener('resize', setViewportWidthHandler);

    return () => {
      window.removeEventListener('resize', setViewportWidthHandler);
    };
  }, []);

  // ELEMENTS TO HIGHLIGHT CHECK
  // Try to find all elements to highlight, and set it to a state for further use.
  // If not found, set error state to true, and give console.error
  useEffect(() => {
    if (!activeTutorial || tutorialError || appIsFetching) return;

    const handleTryToGetElementsAgain = async () => {
      // Wait for 300ms before trying again
      await new Promise((resolve) => setTimeout(resolve, 300));

      const allElementsToHighlightInTimeout =
        getAllElementsToHighlight(activeTutorial);
      /* c8 ignore start */
      if (allElementsToHighlightInTimeout.every((item) => item !== null)) {
        setAllElementsToHighlight(allElementsToHighlightInTimeout);
        /* c8 ignore end */
      } else {
        console.error(
          'Could not find all elements to highlight for the tutorial. \n ' +
            'This is a list of elements that were found for each step: ',
          allElementsToHighlightInTimeout
        );
        setTutorialError(true);
      }
    };

    const allElementsToHighlight = getAllElementsToHighlight(activeTutorial);

    if (allElementsToHighlight.every((item) => item !== null)) {
      setAllElementsToHighlight(allElementsToHighlight);
    } else {
      handleTryToGetElementsAgain().catch((error) => {
        console.error('Error trying to get elements to highlight', error);
      });
    }
  }, [
    activeTutorial,
    currentStep,
    tutorialError,
    shortNameFromParams,
    appIsFetching,
  ]);

  // CUSTOM COMPONENT CHECK
  // Check to see if the tutorial has the custom components for any custom steps it has.
  // Sets tutorialError to true if it does not find a match for all potential custom steps
  useEffect(() => {
    if (!activeTutorial || tutorialError || appIsFetching) return;
    const customKeysFromSteps = activeTutorial.steps
      .filter((step) => step.key !== undefined && step.key !== null)
      // Writing 'customStep.key as string' for coverage, we know its string since we filter out right before the map
      .map((customStep) => customStep.key);
    if (customKeysFromSteps.length === 0) return;

    const customKeysFromComponents = customStepComponents?.map(
      (stepComponent) => stepComponent.key
    );

    if (!customKeysFromComponents || customKeysFromComponents.length === 0) {
      console.error(
        'Could not find any custom components passed to the TutorialProvider \n' +
          'Expected these keys for the active tutorial: ',
        customKeysFromSteps
      );
      setTutorialError(true);
      return;
    }

    const stepsHaveComponents = customKeysFromSteps.map(
      (keyFromStep) =>
        keyFromStep && customKeysFromComponents?.includes(keyFromStep)
    );

    if (stepsHaveComponents.some((step) => step !== true)) {
      console.error(
        'Could not find the custom components related to the active tutorial. ' +
          '\n The active tutorial expected to find these keys:  ',
        customKeysFromSteps,
        '\n However in the custom components we only found these keys: ',
        customKeysFromComponents
      );
      setTutorialError(true);
    }
  }, [activeTutorial, appIsFetching, customStepComponents, tutorialError]);

  return (
    <TutorialContext.Provider
      value={{
        currentStepObject,
        activeTutorial,
        setActiveTutorial,
        currentStep,
        setCurrentStep,
        allElementsToHighlight,
        setAllElementsToHighlight,
        customStepComponents,
        isLastStep,
        dialogRef,
        clearSearchParam,
        shortNameFromParams,
        setShortNameFromParams,
        tutorialsFromProps: tutorials ?? [],
        tutorialError,
        setTutorialError,
        viewportWidth,
        appName,
        environmentName,
      }}
    >
      <TutorialProviderInner />

      {children}
    </TutorialContext.Provider>
  );
};

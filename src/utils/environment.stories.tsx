import { Meta, StoryFn } from '@storybook/react';

import UtilStory from './UtilStory';

export default {
  title: 'Utils/Environment',
} as Meta;

export const GetConfig: StoryFn = () => {
  const codeText = `
  getConfig(param: env variable name) => helper function to get environment variables
  `;
  return <UtilStory name="getConfig" codeText={codeText} />;
};

export const GetAppName: StoryFn = () => {
  const codeText = `
  getAppName() => gets APP_NAME env variable
  `;
  return <UtilStory name="getAppName" codeText={codeText} />;
};

export const GetApiUrl: StoryFn = () => {
  const codeText = `
  getApiUrl() => gets API_URL env variable
  `;
  return <UtilStory name="getApiUrl" codeText={codeText} />;
};

export const GetEnvironmentName: StoryFn = () => {
  const codeText = `
  getEnvironmentName() => gets ENVIRONMENT_NAME env variable
  `;
  return <UtilStory name="getEnvironmentName" codeText={codeText} />;
};

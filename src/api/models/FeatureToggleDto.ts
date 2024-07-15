/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FeatureAPIType } from './FeatureAPIType';

export type FeatureToggleDto = {
  applicationName: string;
  features: Array<FeatureAPIType>;
};

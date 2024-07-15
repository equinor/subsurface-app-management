/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GraphUser } from './GraphUser';

export type FeatureAPIType = {
  uuid: string;
  featureKey: string;
  description: string;
  activeUsers: Array<GraphUser>;
  activeEnvironments: Array<string>;
};

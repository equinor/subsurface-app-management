/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserImpersonationRoleSnapshot } from './UserImpersonationRoleSnapshot';
export type ImpersonateUserUpdateDto = {
  id?: string | null;
  firstName: string;
  lastName: string;
  uniqueName: string;
  email?: string | null;
  field?: string | null;
  well?: string | null;
  internalApplicationRoleSnapshots?: Array<UserImpersonationRoleSnapshot> | null;
  appName: string;
  roles: Array<string>;
  activeUsers: Array<string>;
};

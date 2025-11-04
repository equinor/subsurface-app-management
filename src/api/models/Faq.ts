/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Faq = {
  updatedBy?: string | null;
  updatedByName?: string | null;
  updatedDate?: string | null;
  createdBy: string;
  createdByName: string;
  createdDate: string;
  id: number;
  question: string;
  answer: string;
  visible: boolean;
  orderBy?: number | null;
  roles?: Array<string> | null;
  categoryId: number;
};

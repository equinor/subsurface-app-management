/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Faq } from 'src/api';
export type FaqCategory = {
  id: number;
  categoryName: string;
  orderBy?: number | null;
  applicationId: string;
  faqs: Array<Faq>;
};

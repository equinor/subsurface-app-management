/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FaqDto } from './FaqDto';
export type FaqCategoriesWithFaqDto = {
  id: number;
  fkParentCategoryId: number;
  categoryName: string;
  orderBy?: number | null;
  visible: boolean;
  applicationId: string;
  faqs?: Array<FaqDto> | null;
  updatedDate?: string | null;
  createdDate?: string | null;
  subCategories?: Array<FaqCategoriesWithFaqDto> | null;
};

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Faq } from '../models/Faq';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI_SAM_Prod } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import type { FaqCategoriesWithFaqDto } from '../models/FaqCategoriesWithFaqDto';
export class FaqService {
  /**
   * Get FAQ categories and related FAQs based on application id
   * @param applicationId
   * @returns FaqCategory OK
   * @throws ApiError
   */
  public static getCategoriesWithFaqsFromApplicationName(
    applicationName: string
  ): CancelablePromise<Array<FaqCategoriesWithFaqDto>> {
    return __request(OpenAPI_SAM_Prod, {
      method: 'GET',
      url: '/api/v1/Faq/faqcategorieswithfaqs/{applicationName}',
      path: {
        applicationName: applicationName,
      },
    });
  }
  /**
   * Get FAQ image
   * @param path
   * @returns string OK
   * @throws ApiError
   */
  public static getFaqImage(path: string): CancelablePromise<string> {
    return __request(OpenAPI_SAM_Prod, {
      method: 'GET',
      url: '/api/v1/Faq/getfaqimage/{path}',
      path: {
        path: path,
      },
      errors: {
        404: `Not Found`,
      },
    });
  }
  /**
   * Get FAQ categories from application id
   * @param applicationId
   * @returns FaqCategory OK
   * @throws ApiError
   */
  public static getFaqCategoriesFromApplicationId(
    applicationId: string
  ): CancelablePromise<Array<FaqCategoriesWithFaqDto>> {
    return __request(OpenAPI_SAM_Prod, {
      method: 'GET',
      url: '/api/v1/Faq/faqcategories/{applicationId}',
      path: {
        applicationId: applicationId,
      },
    });
  }
  /**
   * Get FAQs from category id
   * @param categoryId
   * @returns Faq OK
   * @throws ApiError
   */
  public static getFaqsFromCategoryId(
    categoryId: number
  ): CancelablePromise<Array<Faq>> {
    return __request(OpenAPI_SAM_Prod, {
      method: 'GET',
      url: '/api/v1/Faq/faqs/{categoryId}',
      path: {
        categoryId: categoryId,
      },
    });
  }
  /**
   * Get FAQ by id
   * @param id
   * @returns Faq OK
   * @throws ApiError
   */
  public static getFaqById(id: number): CancelablePromise<Faq> {
    return __request(OpenAPI_SAM_Prod, {
      method: 'GET',
      url: '/api/v1/Faq/faq/{id}',
      path: {
        id: id,
      },
    });
  }
}

import EnvironmentConfig from '../config/environment.config';
import { recordApiCall } from './apiEvidence';

type ApiRequestOptions = Omit<Partial<Cypress.RequestOptions>, 'url'> & { url: string };

export const request = <T>({
  url,
  ...options
}: ApiRequestOptions): Cypress.Chainable<Cypress.Response<T>> => {
  const fullUrl = `${EnvironmentConfig.getApiUrl()}${url}`;

  return cy
    .request<T>({
      failOnStatusCode: false,
      ...options,
      url: fullUrl,
    })
    .then((response) => {
      const query = options.qs
        ? new URLSearchParams(Object.entries(options.qs).map(([key, value]) => [key, String(value)])).toString()
        : '';

      recordApiCall({
        method: options.method ?? 'GET',
        url: query ? `${fullUrl}?${query}` : fullUrl,
        requestBody: options.body,
        status: response.status,
        responseBody: response.body,
      });
      return response;
    });
};

import EnvironmentConfig from '../environment.config';
import RoutesConfig from '../routes';

export type InterceptorAlias = '@postLogin' | '@postUser' | '@postProduct';

const apiUrl = (path: string): string => `${EnvironmentConfig.getApiUrl()}${path}`;

export class InterceptorsConfig {
  static watchLogin(): void {
    cy.intercept('POST', apiUrl(RoutesConfig.api.login)).as('postLogin');
  }

  static watchUserRegistration(): void {
    cy.intercept('POST', apiUrl(RoutesConfig.api.users)).as('postUser');
  }

  static watchProductRegistration(): void {
    cy.intercept('POST', apiUrl(RoutesConfig.api.products)).as('postProduct');
  }

  static waitForStatus(alias: InterceptorAlias, status: number): void {
    cy.wait(alias).its('response.statusCode').should('eq', status);
  }
}

export default InterceptorsConfig;

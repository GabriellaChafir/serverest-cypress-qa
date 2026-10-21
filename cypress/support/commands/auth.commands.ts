import { LoginService } from '../api/loginService';
import LoginPage from '../pages/LoginPage';
import RoutesConfig from '../config/routes';
import type { Credentials } from '../types';

Cypress.Commands.add('getToken', ({ email, password }: Credentials) =>
  LoginService.authenticate({ email, password }).then(({ status, body }) => {
    expect(status, 'login status (setup)').to.eq(200);
    return body.authorization as string;
  }),
);

Cypress.Commands.add('loginViaUi', ({ email, password }: Credentials) => {
  cy.session(['ui', email], () => {
    new LoginPage().visit().login({ email, password });
    cy.url().should('include', RoutesConfig.pages.adminHome);
  });
});

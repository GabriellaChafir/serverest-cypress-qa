import RoutesConfig from '../config/routes';
import Selectors from '../config/selectors';
import type { Credentials } from '../types';

class LoginPage {
  visit(): this {
    cy.visit(RoutesConfig.pages.login);
    this.buttonSubmit.should('be.visible');
    return this;
  }

  get inputEmail(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(Selectors.login.emailInput);
  }

  get inputPassword(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(Selectors.login.passwordInput);
  }

  get buttonSubmit(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(Selectors.login.submitButton);
  }

  fillLoginForm({ email, password }: Credentials): this {
    this.inputEmail.clear().type(email);
    this.inputPassword.clear().type(password, { log: false });
    return this;
  }

  submitLogin(): this {
    this.buttonSubmit.should('be.visible').and('not.be.disabled').click();
    return this;
  }

  login(credentials: Credentials): this {
    return this.fillLoginForm(credentials).submitLogin();
  }
}

export default LoginPage;

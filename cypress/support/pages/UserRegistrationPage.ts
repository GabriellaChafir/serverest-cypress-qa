import RoutesConfig from '../config/routes';
import Selectors from '../config/selectors';
import type { User } from '../types';

class UserRegistrationPage {
  visit(): this {
    cy.visit(RoutesConfig.pages.userRegistration);
    this.buttonSubmit.should('be.visible');
    return this;
  }

  get inputName(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(Selectors.userRegistration.nameInput);
  }

  get inputEmail(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(Selectors.userRegistration.emailInput);
  }

  get inputPassword(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(Selectors.userRegistration.passwordInput);
  }

  get checkboxAdmin(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(Selectors.userRegistration.adminCheckbox);
  }

  get buttonSubmit(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(Selectors.userRegistration.submitButton);
  }

  fillForm({ nome, email, password, administrador }: User): this {
    this.inputName.type(nome);
    this.inputEmail.type(email);
    this.inputPassword.type(password, { log: false });
    if (administrador === 'true') {
      this.checkboxAdmin.check();
    }
    return this;
  }

  submit(): this {
    this.buttonSubmit.click();
    return this;
  }

  register(user: User): this {
    return this.fillForm(user).submit();
  }
}

export default UserRegistrationPage;

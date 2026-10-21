import RoutesConfig from '../config/routes';
import Selectors from '../config/selectors';
import type { Product } from '../types';

class ProductRegistrationPage {
  visit(): this {
    cy.visit(RoutesConfig.pages.productRegistration);
    this.buttonSubmit.should('be.visible');
    return this;
  }

  get inputName(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(Selectors.productRegistration.nameInput);
  }

  get inputPrice(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(Selectors.productRegistration.priceInput);
  }

  get inputDescription(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(Selectors.productRegistration.descriptionInput);
  }

  get inputQuantity(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(Selectors.productRegistration.quantityInput);
  }

  get buttonSubmit(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(Selectors.productRegistration.submitButton);
  }

  fillForm({ nome, preco, descricao, quantidade }: Product): this {
    this.inputName.type(nome);
    this.inputPrice.type(String(preco));
    this.inputDescription.type(descricao);
    this.inputQuantity.type(String(quantidade));
    return this;
  }

  submit(): this {
    this.buttonSubmit.click();
    return this;
  }

  register(product: Product): this {
    return this.fillForm(product).submit();
  }
}

export default ProductRegistrationPage;

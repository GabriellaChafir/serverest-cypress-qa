import RoutesConfig from '../config/routes';

class HomeAdminPage {
  visit(): this {
    cy.visit(RoutesConfig.pages.adminHome);
    return this;
  }

  get navCadastrarProdutos(): Cypress.Chainable {
    return cy.get('[data-testid="cadastrar-produtos"]');
  }

  get buttonLogout(): Cypress.Chainable {
    return cy.get('[data-testid="logout"]');
  }

  logout(): this {
    this.buttonLogout.click();
    return this;
  }
}

export default HomeAdminPage;

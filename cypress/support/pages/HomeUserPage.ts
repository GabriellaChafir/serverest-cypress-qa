class HomeUserPage {
  get navListaDeCompras(): Cypress.Chainable {
    return cy.get('[data-testid="lista-de-compras"]');
  }
}

export default HomeUserPage;

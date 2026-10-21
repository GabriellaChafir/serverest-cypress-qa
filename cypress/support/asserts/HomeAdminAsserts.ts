import RoutesConfig from '../config/routes';
import type HomeAdminPage from '../pages/HomeAdminPage';

class HomeAdminAsserts {
  private homeAdminPage: HomeAdminPage;

  constructor(homeAdminPage: HomeAdminPage) {
    this.homeAdminPage = homeAdminPage;
  }

  verifyAccess(): this {
    cy.url().should('include', RoutesConfig.pages.adminHome);
    this.homeAdminPage.navCadastrarProdutos.should('be.visible');
    return this;
  }
}

export default HomeAdminAsserts;

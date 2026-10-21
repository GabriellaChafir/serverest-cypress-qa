import RoutesConfig from '../config/routes';
import type HomeUserPage from '../pages/HomeUserPage';

class HomeUserAsserts {
  private homeUserPage: HomeUserPage;

  constructor(homeUserPage: HomeUserPage) {
    this.homeUserPage = homeUserPage;
  }

  verifyAccess(): this {
    cy.url().should('include', RoutesConfig.pages.userHome);
    this.homeUserPage.navListaDeCompras.should('be.visible');
    return this;
  }
}

export default HomeUserAsserts;

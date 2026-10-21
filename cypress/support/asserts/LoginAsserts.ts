import messages from '../../fixtures/messages.json';
import InterceptorsConfig from '../config/interceptors';
import RoutesConfig from '../config/routes';
import type LoginPage from '../pages/LoginPage';
import AlertAsserts from './AlertAsserts';

class LoginAsserts {
  private loginPage: LoginPage;

  constructor(loginPage: LoginPage) {
    this.loginPage = loginPage;
  }

  verifyLoginRequest(status: number): this {
    InterceptorsConfig.waitForStatus('@postLogin', status);
    return this;
  }

  verifyInvalidCredentials(): this {
    this.verifyLoginRequest(401);
    AlertAsserts.verifyMessage(messages.invalidCredentials);
    cy.url().should('include', RoutesConfig.pages.login);
    this.loginPage.buttonSubmit.should('be.visible');
    return this;
  }

  verifyLogout(): this {
    cy.url().should('include', RoutesConfig.pages.login);
    this.loginPage.buttonSubmit.should('be.visible');
    return this;
  }

  verifyAccessDenied(): this {
    cy.url().should('include', RoutesConfig.pages.login);
    this.loginPage.buttonSubmit.should('be.visible');
    return this;
  }
}

export default LoginAsserts;

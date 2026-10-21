import messages from '../../fixtures/messages.json';
import InterceptorsConfig from '../config/interceptors';
import RoutesConfig from '../config/routes';
import type UserRegistrationPage from '../pages/UserRegistrationPage';
import AlertAsserts from './AlertAsserts';

class UserRegistrationAsserts {
  private userRegistrationPage: UserRegistrationPage;

  constructor(userRegistrationPage: UserRegistrationPage) {
    this.userRegistrationPage = userRegistrationPage;
  }

  verifyUserCreated(): this {
    InterceptorsConfig.waitForStatus('@postUser', 201);
    return this;
  }

  verifyEmailAlreadyInUse(): this {
    InterceptorsConfig.waitForStatus('@postUser', 400);
    AlertAsserts.verifyMessage(messages.emailInUse);
    cy.url().should('include', RoutesConfig.pages.userRegistration);
    this.userRegistrationPage.buttonSubmit.should('be.visible');
    return this;
  }
}

export default UserRegistrationAsserts;

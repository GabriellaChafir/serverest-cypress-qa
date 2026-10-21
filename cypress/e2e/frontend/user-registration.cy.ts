import { UserRegistrationAsserts, HomeAdminAsserts, HomeUserAsserts } from '../../support/asserts';
import InterceptorsConfig from '../../support/config/interceptors';
import { buildUser } from '../../support/factories/userFactory';
import UserRegistrationPage from '../../support/pages/UserRegistrationPage';
import HomeAdminPage from '../../support/pages/HomeAdminPage';
import HomeUserPage from '../../support/pages/HomeUserPage';
import type { User } from '../../support/types';

describe('Frontend | Cenário 1 - Cadastro de usuário', () => {
  const userRegistrationPage = new UserRegistrationPage();
  const userRegistrationAsserts = new UserRegistrationAsserts(userRegistrationPage);
  const homeAdminAsserts = new HomeAdminAsserts(new HomeAdminPage());
  const homeUserAsserts = new HomeUserAsserts(new HomeUserPage());
  let user: User;

  beforeEach(() => {
    user = buildUser();
    InterceptorsConfig.watchUserRegistration();
    userRegistrationPage.visit();
  });

  afterEach(() => {
    cy.deleteUserByEmail(user.email);
  });

  it('deve cadastrar um usuário administrador e acessar a home do admin', () => {
    userRegistrationPage.register(user);

    userRegistrationAsserts.verifyUserCreated();
    homeAdminAsserts.verifyAccess();
  });

  it('deve cadastrar um usuário não administrador e ser direcionado para a loja', () => {
    user = buildUser({ administrador: 'false' });
    userRegistrationPage.register(user);

    userRegistrationAsserts.verifyUserCreated();
    homeUserAsserts.verifyAccess();
  });

  it('não deve cadastrar um usuário com e-mail já utilizado', () => {
    cy.createUserViaApi().then((existing) => {
      user = buildUser({ email: existing.email });

      userRegistrationPage.register(user);

      userRegistrationAsserts.verifyEmailAlreadyInUse();
    });
  });
});

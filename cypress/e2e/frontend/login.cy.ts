import { HomeAdminAsserts, HomeUserAsserts, LoginAsserts } from '../../support/asserts';
import { UsersService } from '../../support/api/usersService';
import InterceptorsConfig from '../../support/config/interceptors';
import HomeAdminPage from '../../support/pages/HomeAdminPage';
import HomeUserPage from '../../support/pages/HomeUserPage';
import LoginPage from '../../support/pages/LoginPage';
import type { CreatedUser } from '../../support/types';
import { LOGIN_NEGATIVE_SCENARIOS } from './scenarios/login.scenarios';

describe('Frontend | Cenário 2 - Login', () => {
  const loginPage = new LoginPage();
  const loginAsserts = new LoginAsserts(loginPage);
  const homeAdminPage = new HomeAdminPage();
  const homeAdminAsserts = new HomeAdminAsserts(homeAdminPage);
  const homeUserAsserts = new HomeUserAsserts(new HomeUserPage());
  let user: CreatedUser;

  beforeEach(() => {
    cy.createUserViaApi().then((created) => {
      user = created;
    });
    InterceptorsConfig.watchLogin();
    loginPage.visit();
  });

  afterEach(() => {
    UsersService.delete(user._id);
  });

  it('deve realizar login com credenciais válidas e acessar a home do admin', () => {
    loginPage.login(user);

    loginAsserts.verifyLoginRequest(200);
    homeAdminAsserts.verifyAccess();
  });

  it('deve realizar login como usuário não administrador e acessar a loja', () => {
    cy.createUserViaApi({ administrador: 'false' }).then((nonAdmin) => {
      UsersService.delete(user._id);
      user = nonAdmin;

      loginPage.login(nonAdmin);
      loginAsserts.verifyLoginRequest(200);
      homeUserAsserts.verifyAccess();
    });
  });

  it('deve realizar logout e ser redirecionado para a página de login', () => {
    loginPage.login(user);

    homeAdminAsserts.verifyAccess();
    homeAdminPage.logout();
    loginAsserts.verifyLogout();
  });

  it('deve encerrar a sessão após logout impedindo acesso ao painel', () => {
    loginPage.login(user);

    homeAdminAsserts.verifyAccess();
    homeAdminPage.logout();
    homeAdminPage.visit();
    loginAsserts.verifyLogout();
  });

  it('não deve permitir acesso ao painel sem autenticação', () => {
    homeAdminPage.visit();

    loginAsserts.verifyAccessDenied();
  });

  LOGIN_NEGATIVE_SCENARIOS.forEach(({ name, credentials }) => {
    it(`não deve realizar login: ${name}`, () => {
      loginPage.login(credentials(user));

      loginAsserts.verifyInvalidCredentials();
    });
  });
});

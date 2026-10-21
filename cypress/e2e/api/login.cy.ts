import messages from '../../fixtures/messages.json';
import { LoginService } from '../../support/api/loginService';
import { UsersService } from '../../support/api/usersService';
import type { CreatedUser } from '../../support/types';
import { LOGIN_NEGATIVE_SCENARIOS } from './scenarios/login.scenarios';

describe('API | Cenário 2 - Autenticação (/login)', () => {
  let user: CreatedUser;

  beforeEach(() => {
    cy.createUserViaApi().then((created) => {
      user = created;
    });
  });

  afterEach(() => {
    UsersService.delete(user._id);
  });

  it('deve autenticar com credenciais válidas e retornar um token Bearer', () => {
    LoginService.authenticate({ email: user.email, password: user.password }).then(
      ({ status, body }) => {
        expect(status).to.eq(200);
        expect(body.message).to.eq(messages.loginSuccess);
        expect(body.authorization).to.match(/^Bearer .+/);
      },
    );
  });

  LOGIN_NEGATIVE_SCENARIOS.forEach((scenario) => {
    it(`não deve autenticar: ${scenario.name}`, () => {
      LoginService.authenticate(scenario.credentials(user)).then(({ status, body }) => {
        expect(status).to.eq(scenario.status);
        expect(body).to.not.have.property('authorization');

        if (scenario.message) {
          expect(body.message).to.eq(scenario.message);
        }
        scenario.invalidFields?.forEach((field) => {
          expect(body).to.have.property(field);
        });
      });
    });
  });
});

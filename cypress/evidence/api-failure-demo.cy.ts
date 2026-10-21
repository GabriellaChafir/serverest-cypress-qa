import { LoginService } from '../support/api/loginService';
import { UsersService } from '../support/api/usersService';
import type { CreatedUser } from '../support/types';

// Falha proposital: prova que o relatório recebe a requisição e a resposta da API quando um teste quebra.
// Fica fora de cypress/e2e para não entrar no `npm test`; rode com `npm run test:evidence`.
describe('Demonstração | falha proposital de API', () => {
  let user: CreatedUser;

  before(() => {
    cy.createUserViaApi().then((created) => {
      user = created;
    });
  });

  after(() => {
    UsersService.delete(user._id);
  });

  it('deve falhar de propósito para gerar a evidência da requisição e da resposta', () => {
    LoginService.authenticate({ email: user.email, password: user.password }).then(({ status }) => {
      expect(status, 'status propositalmente errado').to.eq(201);
    });
  });
});

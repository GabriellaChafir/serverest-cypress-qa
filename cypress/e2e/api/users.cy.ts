import messages from '../../fixtures/messages.json';
import { UsersService } from '../../support/api/usersService';
import { buildUser } from '../../support/factories/userFactory';
import { userSchema, userListSchema } from '../../support/schemas/userSchema';
import { idOf } from '../../support/utils/responseHelpers';
import { validateSchema } from '../../support/utils/schemaValidator';

describe('API | Cenário 1 - Gestão de usuários (/usuarios)', () => {
  const idsToDelete: string[] = [];

  beforeEach(() => {
    idsToDelete.length = 0;
  });

  afterEach(() => {
    idsToDelete.forEach((id) => UsersService.delete(id));
  });

  it('deve cadastrar um usuário e consultá-lo respeitando o contrato', () => {
    const data = buildUser();

    UsersService.create(data).then(({ status, body }) => {
      expect(status).to.eq(201);
      expect(body.message).to.eq(messages.registrationSuccess);
      const id = idOf(body);
      idsToDelete.push(id);

      UsersService.getById(id).then((response) => {
        expect(response.status).to.eq(200);
        validateSchema(userSchema, response.body);
        expect(response.body).to.deep.include({
          nome: data.nome,
          email: data.email,
          administrador: data.administrador,
        });
      });
    });
  });

  it('deve atualizar os dados de um usuário existente', () => {
    cy.createUserViaApi().then((created) => {
      idsToDelete.push(created._id);
      const { _id, ...updatedData } = { ...created, nome: 'Nome Atualizado QA' };

      UsersService.update(_id, updatedData).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body.message).to.eq(messages.recordUpdated);
      });

      UsersService.getById(_id).then(({ body }) => {
        expect(body).to.deep.include({
          nome: 'Nome Atualizado QA',
          email: created.email,
          administrador: created.administrador,
        });
      });
    });
  });

  it('deve excluir um usuário e não encontrá-lo em uma nova consulta', () => {
    cy.createUserViaApi().then((created) => {
      idsToDelete.push(created._id);

      UsersService.delete(created._id).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body.message).to.eq(messages.recordDeleted);
      });

      UsersService.getById(created._id).then(({ status, body }) => {
        expect(status).to.eq(400);
        expect(body.message).to.eq(messages.userNotFound);
      });
    });
  });

  it('não deve cadastrar um usuário com e-mail já utilizado', () => {
    cy.createUserViaApi().then((created) => {
      idsToDelete.push(created._id);

      UsersService.create(buildUser({ email: created.email })).then(({ status, body }) => {
        expect(status).to.eq(400);
        expect(body.message).to.eq(messages.emailInUse);
      });
    });
  });

  it('não deve atualizar um usuário com e-mail já utilizado por outro', () => {
    cy.createUserViaApi().then((userA) => {
      idsToDelete.push(userA._id);

      cy.createUserViaApi().then((userB) => {
        idsToDelete.push(userB._id);
        const { _id, ...updatedData } = { ...userB, email: userA.email };

        UsersService.update(_id, updatedData).then(({ status, body }) => {
          expect(status).to.eq(400);
          expect(body.message).to.eq(messages.emailInUse);
        });
      });
    });
  });

  it('deve listar usuários e refletir o total cadastrado', () => {
    cy.createUserViaApi().then((created) => {
      idsToDelete.push(created._id);

      UsersService.list({ email: created.email }).then(({ status, body }) => {
        expect(status).to.eq(200);
        validateSchema(userListSchema, body);
        expect(body.quantidade).to.eq(1);
        expect(body.usuarios).to.have.length(1);
        expect(body.usuarios[0]).to.deep.include({
          nome: created.nome,
          email: created.email,
        });
      });
    });
  });
});

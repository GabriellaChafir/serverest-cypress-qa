import messages from '../../fixtures/messages.json';
import { ProductsService } from '../../support/api/productsService';
import { UsersService } from '../../support/api/usersService';
import { buildProduct } from '../../support/factories/productFactory';
import { productSchema, productListSchema } from '../../support/schemas/productSchema';
import type { CreatedUser } from '../../support/types';
import { idOf } from '../../support/utils/responseHelpers';
import { validateSchema } from '../../support/utils/schemaValidator';
import { PRODUCT_UNAUTHORIZED_SCENARIOS } from './scenarios/products.scenarios';

describe('API | Cenário 3 - Gestão de produtos (/produtos)', () => {
  let admin: CreatedUser;
  let adminToken: string;
  let productId: string | undefined;

  before(() => {
    cy.createUserViaApi({ administrador: 'true' }).then((created) => {
      admin = created;
      cy.getToken(admin).then((token) => {
        adminToken = token;
      });
    });
  });

  after(() => {
    UsersService.delete(admin._id);
  });

  beforeEach(() => {
    productId = undefined;
  });

  afterEach(() => {
    if (productId) {
      ProductsService.delete(productId, adminToken);
    }
  });

  it('deve cadastrar um produto como administrador e consultá-lo respeitando o contrato', () => {
    const product = buildProduct();

    ProductsService.create(product, adminToken).then(({ status, body }) => {
      expect(status).to.eq(201);
      expect(body.message).to.eq(messages.registrationSuccess);
      productId = idOf(body);

      ProductsService.getById(productId).then((response) => {
        expect(response.status).to.eq(200);
        validateSchema(productSchema, response.body);
        expect(response.body).to.deep.include({
          nome: product.nome,
          preco: product.preco,
          descricao: product.descricao,
          quantidade: product.quantidade,
        });
      });
    });
  });

  PRODUCT_UNAUTHORIZED_SCENARIOS.forEach((scenario) => {
    it(`não deve cadastrar um produto ${scenario.name}`, () => {
      ProductsService.create(buildProduct(), scenario.token).then(({ status, body }) => {
        expect(status).to.eq(scenario.status);
        expect(body.message).to.eq(scenario.message);
      });
    });
  });

  it('não deve permitir que usuário não administrador cadastre produtos', () => {
    cy.createUserViaApi({ administrador: 'false' }).then((regular) => {
      cy.getToken(regular).then((regularToken) => {
        ProductsService.create(buildProduct(), regularToken).then(({ status, body }) => {
          expect(status).to.eq(403);
          expect(body.message).to.eq(messages.adminOnlyRoute);
        });
      });
      cy.then(() => UsersService.delete(regular._id));
    });
  });

  it('não deve cadastrar dois produtos com o mesmo nome', () => {
    const product = buildProduct();

    ProductsService.create(product, adminToken).then(({ body }) => {
      productId = idOf(body);

      ProductsService.create(product, adminToken).then((duplicate) => {
        expect(duplicate.status).to.eq(400);
        expect(duplicate.body.message).to.eq(messages.duplicateProduct);
      });
    });
  });

  it('deve atualizar um produto e confirmar os novos dados', () => {
    const product = buildProduct();

    ProductsService.create(product, adminToken).then(({ body }) => {
      productId = idOf(body);
      const updatedData = { ...product, preco: 999, descricao: 'Descrição atualizada QA' };

      ProductsService.update(productId, updatedData, adminToken).then(
        ({ status, body: updateBody }) => {
          expect(status).to.eq(200);
          expect(updateBody.message).to.eq(messages.recordUpdated);
        },
      );

      ProductsService.getById(productId).then(({ body: queryBody }) => {
        expect(queryBody.preco).to.eq(999);
        expect(queryBody.descricao).to.eq('Descrição atualizada QA');
        expect(queryBody.nome).to.eq(product.nome);
        expect(queryBody.quantidade).to.eq(product.quantidade);
      });
    });
  });

  it('deve excluir um produto e não encontrá-lo em nova consulta', () => {
    ProductsService.create(buildProduct(), adminToken).then(({ body }) => {
      const id = idOf(body);

      ProductsService.delete(id, adminToken).then(({ status, body: deleteBody }) => {
        expect(status).to.eq(200);
        expect(deleteBody.message).to.eq(messages.recordDeleted);
      });

      ProductsService.getById(id).then(({ status, body: queryBody }) => {
        expect(status).to.eq(400);
        expect(queryBody.message).to.eq(messages.productNotFound);
      });
    });
  });

  it('deve listar produtos e refletir o total cadastrado', () => {
    const product = buildProduct();

    ProductsService.create(product, adminToken).then(({ body }) => {
      productId = idOf(body);

      ProductsService.list({ nome: product.nome }).then(({ status, body: listBody }) => {
        expect(status).to.eq(200);
        validateSchema(productListSchema, listBody);
        expect(listBody.quantidade).to.eq(1);
        expect(listBody.produtos).to.have.length(1);
        expect(listBody.produtos[0]).to.deep.include({
          nome: product.nome,
          preco: product.preco,
          descricao: product.descricao,
          quantidade: product.quantidade,
        });
      });
    });
  });
});

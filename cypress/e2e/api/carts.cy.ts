import messages from '../../fixtures/messages.json';
import { CartsService } from '../../support/api/cartsService';
import { ProductsService } from '../../support/api/productsService';
import { UsersService } from '../../support/api/usersService';
import { cartSchema, cartListSchema } from '../../support/schemas/cartSchema';
import type { CreatedProduct, CreatedUser } from '../../support/types';
import { idOf } from '../../support/utils/responseHelpers';
import { validateSchema } from '../../support/utils/schemaValidator';
import { CART_UNAUTHORIZED_SCENARIOS } from './scenarios/carts.scenarios';

describe('API | Cenário 4 - Carrinho de compras (/carrinhos)', () => {
  let admin: CreatedUser;
  let adminToken: string;
  let product: CreatedProduct;
  let user: CreatedUser;
  let userToken: string;

  before(() => {
    cy.createUserViaApi({ administrador: 'true' }).then((created) => {
      admin = created;
      cy.getToken(admin).then((token) => {
        adminToken = token;
        cy.createProductViaApi(adminToken, { quantidade: 10 }).then((createdProduct) => {
          product = createdProduct;
        });
      });
    });

    cy.createUserViaApi({ administrador: 'false' }).then((created) => {
      user = created;
      cy.getToken(user).then((token) => {
        userToken = token;
      });
    });
  });

  after(() => {
    ProductsService.delete(product._id, adminToken);
    UsersService.delete(admin._id);
    UsersService.delete(user._id);
  });

  afterEach(() => {
    CartsService.cancelPurchase(userToken);
  });

  it('deve criar um carrinho, validar o contrato e os cálculos de preço', () => {
    const quantity = 3;

    CartsService.create(
      { produtos: [{ idProduto: product._id, quantidade: quantity }] },
      userToken,
    ).then(({ status, body }) => {
      expect(status).to.eq(201);
      expect(body.message).to.eq(messages.registrationSuccess);

      CartsService.getById(idOf(body)).then(({ status: s, body: cart }) => {
        expect(s).to.eq(200);
        validateSchema(cartSchema, cart);
        expect(cart.quantidadeTotal).to.eq(quantity);
        expect(cart.precoTotal).to.eq(product.preco * quantity);
        expect(cart.idUsuario).to.eq(user._id);
      });
    });
  });

  it('deve concluir a compra e reduzir o estoque do produto', () => {
    ProductsService.getExisting(product._id).then(({ quantidade: stockBefore }) => {
      CartsService.create(
        { produtos: [{ idProduto: product._id, quantidade: 2 }] },
        userToken,
      ).then(() => {
        CartsService.checkout(userToken).then(({ status, body }) => {
          expect(status).to.eq(200);
          expect(body.message).to.eq(messages.recordDeleted);
        });

        ProductsService.getExisting(product._id).then(({ quantidade: stockAfter }) => {
          expect(stockAfter).to.eq(stockBefore - 2);
        });
      });
    });
  });

  it('deve cancelar a compra e devolver o estoque ao produto', () => {
    ProductsService.getExisting(product._id).then(({ quantidade: stockBefore }) => {
      CartsService.create(
        { produtos: [{ idProduto: product._id, quantidade: 2 }] },
        userToken,
      ).then(() => {
        CartsService.cancelPurchase(userToken).then(({ status, body }) => {
          expect(status).to.eq(200);
          expect(body.message).to.eq(messages.purchaseCancelled);
        });

        ProductsService.getExisting(product._id).then(({ quantidade: stockAfter }) => {
          expect(stockAfter).to.eq(stockBefore);
        });
      });
    });
  });

  it('não deve permitir que o mesmo usuário tenha mais de um carrinho', () => {
    CartsService.create(
      { produtos: [{ idProduto: product._id, quantidade: 1 }] },
      userToken,
    ).then(() => {
      CartsService.create(
        { produtos: [{ idProduto: product._id, quantidade: 1 }] },
        userToken,
      ).then(({ status, body }) => {
        expect(status).to.eq(400);
        expect(body.message).to.eq(messages.cartAlreadyExists);
      });
    });
  });

  it('não deve permitir adicionar quantidade maior que o estoque disponível', () => {
    ProductsService.getExisting(product._id).then(({ quantidade: currentStock }) => {
      CartsService.create(
        { produtos: [{ idProduto: product._id, quantidade: currentStock + 1 }] },
        userToken,
      ).then(({ status, body }) => {
        expect(status).to.eq(400);
        expect(body.message).to.eq(messages.insufficientStock);
      });
    });
  });

  CART_UNAUTHORIZED_SCENARIOS.forEach((scenario) => {
    it(`não deve criar carrinho ${scenario.name}`, () => {
      CartsService.create(
        { produtos: [{ idProduto: product._id, quantidade: 1 }] },
        scenario.token,
      ).then(({ status, body }) => {
        expect(status).to.eq(scenario.status);
        expect(body.message).to.eq(scenario.message);
      });
    });
  });

  it('deve listar carrinhos filtrando por usuário', () => {
    CartsService.create(
      { produtos: [{ idProduto: product._id, quantidade: 1 }] },
      userToken,
    ).then(() => {
      CartsService.list({ idUsuario: user._id }).then(({ status, body }) => {
        expect(status).to.eq(200);
        validateSchema(cartListSchema, body);
        expect(body.quantidade).to.eq(1);
        expect(body.carrinhos).to.have.length(1);
        expect(body.carrinhos[0].idUsuario).to.eq(user._id);
      });
    });
  });

  // Swagger: sem carrinho aberto, o endpoint responde 200 com a mensagem "carrinho não encontrado".
  it('não deve concluir compra sem carrinho aberto', () => {
    CartsService.checkout(userToken).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.message).to.eq(messages.cartNotFound);
    });
  });

  // Swagger: sem carrinho aberto, o endpoint responde 200 com a mensagem "carrinho não encontrado".
  it('não deve cancelar compra sem carrinho aberto', () => {
    CartsService.cancelPurchase(userToken).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.message).to.eq(messages.cartNotFound);
    });
  });

  it('não deve criar carrinho com produto inexistente', () => {
    CartsService.create(
      { produtos: [{ idProduto: 'nonExistentId000', quantidade: 1 }] },
      userToken,
    ).then(({ status, body }) => {
      expect(status).to.eq(400);
      expect(body.message).to.eq(messages.productNotFound);
    });
  });
});

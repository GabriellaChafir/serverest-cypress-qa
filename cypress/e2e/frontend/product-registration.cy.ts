import { ProductRegistrationAsserts } from '../../support/asserts';
import { ProductsService } from '../../support/api/productsService';
import { UsersService } from '../../support/api/usersService';
import InterceptorsConfig from '../../support/config/interceptors';
import { buildProduct } from '../../support/factories/productFactory';
import ProductRegistrationPage from '../../support/pages/ProductRegistrationPage';
import type { Product, CreatedUser } from '../../support/types';

describe('Frontend | Cenário 3 - Cadastro de produto (administrador)', () => {
  const productRegistrationPage = new ProductRegistrationPage();
  const productRegistrationAsserts = new ProductRegistrationAsserts(productRegistrationPage);
  let admin: CreatedUser;
  let adminToken: string;
  let product: Product;

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
    product = buildProduct();
    cy.loginViaUi(admin);
    productRegistrationPage.visit();
    InterceptorsConfig.watchProductRegistration();
  });

  afterEach(() => {
    cy.deleteProductByName(product.nome, adminToken);
  });

  it('deve cadastrar um produto e exibi-lo na listagem de produtos', () => {
    productRegistrationPage.visit().register(product);

    productRegistrationAsserts.verifyProductCreated().verifyProductListed(product.nome);
  });

  it('não deve cadastrar um produto com nome já utilizado', () => {
    ProductsService.create(product, adminToken).then(() => {
      productRegistrationPage.visit().register(product);

      productRegistrationAsserts.verifyDuplicateProduct();
    });
  });
});

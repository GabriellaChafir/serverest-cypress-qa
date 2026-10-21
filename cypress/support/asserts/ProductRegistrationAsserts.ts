import messages from '../../fixtures/messages.json';
import InterceptorsConfig from '../config/interceptors';
import RoutesConfig from '../config/routes';
import type ProductRegistrationPage from '../pages/ProductRegistrationPage';
import AlertAsserts from './AlertAsserts';

class ProductRegistrationAsserts {
  private productRegistrationPage: ProductRegistrationPage;

  constructor(productRegistrationPage: ProductRegistrationPage) {
    this.productRegistrationPage = productRegistrationPage;
  }

  verifyProductCreated(): this {
    InterceptorsConfig.waitForStatus('@postProduct', 201);
    return this;
  }

  verifyProductListed(name: string): this {
    cy.url().should('include', RoutesConfig.pages.productList);
    cy.contains(name).should('be.visible');
    return this;
  }

  verifyDuplicateProduct(): this {
    InterceptorsConfig.waitForStatus('@postProduct', 400);
    AlertAsserts.verifyMessage(messages.duplicateProduct);
    cy.url().should('include', RoutesConfig.pages.productRegistration);
    this.productRegistrationPage.buttonSubmit.should('be.visible');
    return this;
  }
}

export default ProductRegistrationAsserts;

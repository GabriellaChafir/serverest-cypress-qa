/// <reference types="cypress" />

import type { Credentials, CreatedProduct, CreatedUser, Product, User } from './support/types';

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      createUserViaApi(overrides?: Partial<User>): Chainable<CreatedUser>;
      createProductViaApi(token: string, overrides?: Partial<Product>): Chainable<CreatedProduct>;
      getToken(credentials: Credentials): Chainable<string>;
      loginViaUi(credentials: Credentials): Chainable<void>;
      deleteUserByEmail(email: string): Chainable<void>;
      deleteProductByName(name: string, token: string): Chainable<void>;
    }
  }
}

export {};

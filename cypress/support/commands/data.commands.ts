import { ProductsService } from '../api/productsService';
import { UsersService } from '../api/usersService';
import { buildProduct } from '../factories/productFactory';
import { buildUser } from '../factories/userFactory';
import type { Product, User } from '../types';

Cypress.Commands.add('createUserViaApi', (overrides: Partial<User> = {}) => {
  const user = buildUser(overrides);

  return UsersService.create(user).then(({ status, body }) => {
    expect(status, 'user registration status (setup)').to.eq(201);
    return { ...user, _id: body._id as string };
  });
});

Cypress.Commands.add('createProductViaApi', (token: string, overrides: Partial<Product> = {}) => {
  const product = buildProduct(overrides);

  return ProductsService.create(product, token).then(({ status, body }) => {
    expect(status, 'product registration status (setup)').to.eq(201);
    return { ...product, _id: body._id as string };
  });
});

import { ProductsService } from '../api/productsService';
import { UsersService } from '../api/usersService';

Cypress.Commands.add('deleteUserByEmail', (email: string) => {
  UsersService.list({ email }).then(({ body }) => {
    (body.usuarios ?? []).forEach((user) => UsersService.delete(user._id));
  });
});

Cypress.Commands.add('deleteProductByName', (name: string, token: string) => {
  ProductsService.list({ nome: name }).then(({ body }) => {
    (body.produtos ?? []).forEach((product) => ProductsService.delete(product._id, token));
  });
});

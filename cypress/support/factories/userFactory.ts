import { faker } from '@faker-js/faker';
import type { User } from '../types';

export const buildUser = (overrides: Partial<User> = {}): User => ({
  nome: faker.person.fullName(),
  email: `qa_${faker.string.alphanumeric(10).toLowerCase()}@teste.com`,
  password: faker.internet.password({ length: 10 }),
  administrador: 'true',
  ...overrides,
});

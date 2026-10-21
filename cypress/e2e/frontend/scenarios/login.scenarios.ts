import type { Credentials, CreatedUser } from '../../../support/types';

export type LoginNegativeScenario = {
  name: string;
  credentials: (user: CreatedUser) => Credentials;
};

export const LOGIN_NEGATIVE_SCENARIOS: LoginNegativeScenario[] = [
  {
    name: 'senha inválida',
    credentials: (user) => ({ email: user.email, password: 'wrong-password' }),
  },
  {
    name: 'e-mail não cadastrado',
    credentials: () => ({ email: 'not.registered@test.com', password: 'any-password' }),
  },
];

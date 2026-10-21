import messages from '../../../fixtures/messages.json';
import type { Credentials, CreatedUser } from '../../../support/types';

export type LoginNegativeScenario = {
  name: string;
  credentials: (user: CreatedUser) => Partial<Credentials>;
  status: number;
  message?: string;
  invalidFields?: string[];
};

export const LOGIN_NEGATIVE_SCENARIOS: LoginNegativeScenario[] = [
  {
    name: 'senha inválida',
    credentials: (user) => ({ email: user.email, password: 'wrong-password' }),
    status: 401,
    message: messages.invalidCredentials,
  },
  {
    name: 'e-mail não cadastrado',
    credentials: () => ({ email: 'not.registered@test.com', password: 'any-password' }),
    status: 401,
    message: messages.invalidCredentials,
  },
  {
    name: 'campos obrigatórios ausentes',
    credentials: () => ({}),
    status: 400,
    invalidFields: ['email', 'password'],
  },
  {
    name: 'e-mail com formato inválido',
    credentials: () => ({ email: 'notanemail', password: 'any-password' }),
    status: 400,
    invalidFields: ['email'],
  },
  {
    name: 'e-mail em branco',
    credentials: () => ({ email: '', password: 'any-password' }),
    status: 400,
    invalidFields: ['email'],
  },
  {
    name: 'senha em branco',
    credentials: (user) => ({ email: user.email, password: '' }),
    status: 400,
    invalidFields: ['password'],
  },
  {
    name: 'apenas e-mail, sem senha',
    credentials: (user) => ({ email: user.email }),
    status: 400,
    invalidFields: ['password'],
  },
  {
    name: 'apenas senha, sem e-mail',
    credentials: () => ({ password: 'any-password' }),
    status: 400,
    invalidFields: ['email'],
  },
];

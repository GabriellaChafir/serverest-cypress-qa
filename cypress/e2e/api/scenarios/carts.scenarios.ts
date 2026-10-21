import messages from '../../../fixtures/messages.json';

export type CartUnauthorizedScenario = {
  name: string;
  token?: string;
  status: number;
  message: string;
};

export const CART_UNAUTHORIZED_SCENARIOS: CartUnauthorizedScenario[] = [
  {
    name: 'sem token de autenticação',
    token: undefined,
    status: 401,
    message: messages.invalidToken,
  },
  {
    name: 'com token malformado',
    token: 'Bearer token.invalido',
    status: 401,
    message: messages.invalidToken,
  },
];

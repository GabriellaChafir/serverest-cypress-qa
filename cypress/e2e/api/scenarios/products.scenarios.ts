import messages from '../../../fixtures/messages.json';

export type ProductUnauthorizedScenario = {
  name: string;
  token?: string;
  status: number;
  message: string;
};

export const PRODUCT_UNAUTHORIZED_SCENARIOS: ProductUnauthorizedScenario[] = [
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

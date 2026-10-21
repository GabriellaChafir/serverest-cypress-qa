import type { ApiMessage } from '../types';

export const idOf = (body: ApiMessage): string => {
  expect(body._id, 'id retornado pela API').to.be.a('string');
  return body._id as string;
};

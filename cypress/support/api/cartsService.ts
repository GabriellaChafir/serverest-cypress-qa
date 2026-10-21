import RoutesConfig from '../config/routes';
import type { ApiMessage, Cart, CartList, NewCart } from '../types';
import { request } from './httpClient';

const { carts } = RoutesConfig.api;

const withToken = (token?: string): Record<string, string> =>
  token ? { Authorization: token } : {};

export class CartsService {
  static create(cart: NewCart, token?: string) {
    return request<ApiMessage>({
      method: 'POST',
      url: carts,
      body: cart,
      headers: withToken(token),
    });
  }

  static list(qs: Record<string, string> = {}) {
    return request<CartList>({ method: 'GET', url: carts, qs });
  }

  static getById(id: string) {
    return request<Cart>({ method: 'GET', url: `${carts}/${id}` });
  }

  static checkout(token?: string) {
    return request<ApiMessage>({
      method: 'DELETE',
      url: `${carts}/concluir-compra`,
      headers: withToken(token),
    });
  }

  static cancelPurchase(token?: string) {
    return request<ApiMessage>({
      method: 'DELETE',
      url: `${carts}/cancelar-compra`,
      headers: withToken(token),
    });
  }
}

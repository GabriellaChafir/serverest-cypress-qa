import RoutesConfig from '../config/routes';
import type { ApiMessage, CreatedProduct, ProductList, Product, ProductResponse } from '../types';
import { request } from './httpClient';

const { products } = RoutesConfig.api;

const withToken = (token?: string): Record<string, string> =>
  token ? { Authorization: token } : {};

export class ProductsService {
  static create(product: Product, token?: string) {
    return request<ApiMessage>({
      method: 'POST',
      url: products,
      body: product,
      headers: withToken(token),
    });
  }

  static list(qs: Record<string, string> = {}) {
    return request<ProductList>({ method: 'GET', url: products, qs });
  }

  static getById(id: string) {
    return request<ProductResponse>({ method: 'GET', url: `${products}/${id}` });
  }

  static getExisting(id: string) {
    return ProductsService.getById(id).then(({ status, body }) => {
      expect(status, 'consulta de produto existente').to.eq(200);
      return body as CreatedProduct;
    });
  }

  static update(id: string, product: Product, token?: string) {
    return request<ApiMessage>({
      method: 'PUT',
      url: `${products}/${id}`,
      body: product,
      headers: withToken(token),
    });
  }

  static delete(id: string, token?: string) {
    return request<ApiMessage>({
      method: 'DELETE',
      url: `${products}/${id}`,
      headers: withToken(token),
    });
  }
}

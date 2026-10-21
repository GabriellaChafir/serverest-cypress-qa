import RoutesConfig from '../config/routes';
import type { ApiMessage, UserList, UserResponse, User } from '../types';
import { request } from './httpClient';

const { users } = RoutesConfig.api;

export class UsersService {
  static create(user: User) {
    return request<ApiMessage>({ method: 'POST', url: users, body: user });
  }

  static list(qs: Record<string, string> = {}) {
    return request<UserList>({ method: 'GET', url: users, qs });
  }

  static getById(id: string) {
    return request<UserResponse>({ method: 'GET', url: `${users}/${id}` });
  }

  static update(id: string, user: User) {
    return request<ApiMessage>({ method: 'PUT', url: `${users}/${id}`, body: user });
  }

  static delete(id: string) {
    return request<ApiMessage>({ method: 'DELETE', url: `${users}/${id}` });
  }
}

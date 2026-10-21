import RoutesConfig from '../config/routes';
import type { ApiMessageWithFields, Credentials } from '../types';
import { request } from './httpClient';

export class LoginService {
  static authenticate(credentials: Partial<Credentials>) {
    return request<ApiMessageWithFields>({
      method: 'POST',
      url: RoutesConfig.api.login,
      body: credentials,
    });
  }
}

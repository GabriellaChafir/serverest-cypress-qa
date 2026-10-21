const API_URL = 'https://serverest.dev';

export class EnvironmentConfig {
  static getApiUrl(): string {
    return API_URL;
  }
}

export default EnvironmentConfig;

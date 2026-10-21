type ApiCall = {
  method: string;
  url: string;
  requestBody?: unknown;
  status: number;
  responseBody: unknown;
};

declare global {
  interface Window {
    __apiCalls?: ApiCall[];
  }
}

const SENSITIVE_KEYS = /^(password|authorization)$/i;

const mask = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(mask);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, v]) => [key, SENSITIVE_KEYS.test(key) ? '***' : mask(v)]),
    );
  }
  return value;
};

const MAX_BODY_CHARS = 2000;

const limit = (value: unknown): unknown => {
  const text = JSON.stringify(value);
  if (text === undefined || text.length <= MAX_BODY_CHARS) return value;
  return { _cortado: true, tamanhoOriginal: text.length, inicio: `${text.slice(0, MAX_BODY_CHARS)}…` };
};

// Guardado em window porque o support e o spec são empacotados separadamente e não compartilham módulos.
export const apiCalls = (): ApiCall[] => (window.__apiCalls ??= []);

export const clearApiCalls = (): void => {
  apiCalls().length = 0;
};

export const recordApiCall = (call: ApiCall): void => {
  apiCalls().push({
    ...call,
    requestBody: limit(mask(call.requestBody)),
    responseBody: limit(mask(call.responseBody)),
  });
};

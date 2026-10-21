export const productSchema = {
  type: 'object',
  required: ['nome', 'preco', 'descricao', 'quantidade', '_id'],
  properties: {
    nome: { type: 'string' },
    preco: { type: 'number' },
    descricao: { type: 'string' },
    quantidade: { type: 'number' },
    _id: { type: 'string' },
  },
  additionalProperties: false,
} as const;

export const productListSchema = {
  type: 'object',
  required: ['quantidade', 'produtos'],
  properties: {
    quantidade: { type: 'integer' },
    produtos: { type: 'array', items: productSchema },
  },
  additionalProperties: false,
} as const;

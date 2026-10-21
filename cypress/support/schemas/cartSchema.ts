export const cartSchema = {
  type: 'object',
  required: ['produtos', 'precoTotal', 'quantidadeTotal', 'idUsuario', '_id'],
  properties: {
    produtos: {
      type: 'array',
      items: {
        type: 'object',
        required: ['idProduto', 'quantidade', 'precoUnitario'],
        properties: {
          idProduto: { type: 'string' },
          quantidade: { type: 'number' },
          precoUnitario: { type: 'number' },
        },
        additionalProperties: false,
      },
    },
    precoTotal: { type: 'number' },
    quantidadeTotal: { type: 'number' },
    idUsuario: { type: 'string' },
    _id: { type: 'string' },
  },
  additionalProperties: false,
} as const;

export const cartListSchema = {
  type: 'object',
  required: ['quantidade', 'carrinhos'],
  properties: {
    quantidade: { type: 'integer' },
    carrinhos: { type: 'array', items: cartSchema },
  },
  additionalProperties: false,
} as const;

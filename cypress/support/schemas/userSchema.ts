export const userSchema = {
  type: 'object',
  required: ['nome', 'email', 'password', 'administrador', '_id'],
  properties: {
    nome: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' },
    administrador: { enum: ['true', 'false'] },
    _id: { type: 'string' },
  },
  additionalProperties: false,
} as const;

export const userListSchema = {
  type: 'object',
  required: ['quantidade', 'usuarios'],
  properties: {
    quantidade: { type: 'integer' },
    usuarios: { type: 'array', items: userSchema },
  },
  additionalProperties: false,
} as const;

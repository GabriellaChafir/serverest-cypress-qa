import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true, strict: false });

export const validateSchema = (schema: object, data: unknown): void => {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  expect(valid, `contract violation: ${JSON.stringify(validate.errors)}`).to.eq(true);
};

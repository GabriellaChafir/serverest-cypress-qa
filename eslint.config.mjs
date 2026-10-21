import js from '@eslint/js';
import cypress from 'eslint-plugin-cypress';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['node_modules/', 'cypress/screenshots/', 'cypress/videos/', 'reports/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  cypress.configs.recommended,
  {
    files: ['cypress/cypress.d.ts'],
    rules: {
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
);

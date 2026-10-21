import { apiCalls, clearApiCalls } from '../api/apiEvidence';

const shouldLog = (): boolean =>
  Cypress.config('isInteractive') === true;

beforeEach(() => {
  clearApiCalls();

  if (shouldLog()) {
    cy.log(`Test: ${Cypress.currentTest.titlePath.join(' > ')}`);
  }
});

const isApiSpec = (): boolean => /[\\/]api[\\/]/.test(Cypress.spec.relative);

// Em specs de API a evidência vai em todo teste; nos demais, só quando falha.
afterEach(function (this: Mocha.Context) {
  const failed = this.currentTest?.state === 'failed';
  if ((failed || isApiSpec()) && apiCalls().length > 0) {
    cy.addTestContext({ title: 'API: requisições e respostas', value: [...apiCalls()] });
  }
});

export {};

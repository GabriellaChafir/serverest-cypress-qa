import { defineConfig } from 'cypress';

export default defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'Desafio ServeRest - Relatório de Testes',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    saveJson: true,
    code: false,
  },
  e2e: {
    baseUrl: 'https://front.serverest.dev',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    viewportWidth: 1280,
    viewportHeight: 800,
    video: false,
    defaultCommandTimeout: 8000,
    retries: {
      runMode: 1,
      openMode: 0,
    },
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      return config;
    },
  },
});

import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: 'src/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportHeight: 1080,
    viewportWidth: 1980,
    baseUrl: 'http://localhost:4200',
  },
});

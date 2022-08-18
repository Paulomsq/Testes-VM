const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    defaultCommandTimeout	: 10000,
    baseUrl: 'https://homebroker.guideinvestimentos.com.br/v!3#/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

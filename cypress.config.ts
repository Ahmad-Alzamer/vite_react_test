import { defineConfig } from "cypress";
// import vitePreprocessor from "cypress-vite";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";
// cypress/support/e2e.js
// import '@cypress/code-coverage/support';
export default defineConfig({
  e2e: {
    specPattern: ["**/*.feature", "**/*.cy.ts"],
    baseUrl: "http://localhost:5173/",

    async setupNodeEvents(on, config) {
      // implement node event listeners here
      // on("file:preprocessor", vitePreprocessor());
      // require('@cypress/code-coverage/task')(on, config);
      await addCucumberPreprocessorPlugin(on, config);

      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );
      return config;
    },
  },

});

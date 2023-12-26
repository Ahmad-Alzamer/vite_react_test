import { defineConfig } from "cypress";
// import vitePreprocessor from "cypress-vite";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";

export default defineConfig({
  e2e: {
    specPattern: ["**/*.feature","**/*.cy.ts"],
    baseUrl: "http://localhost:5173/",
    async setupNodeEvents(on, config) {
      // implement node event listeners here
      // on("file:preprocessor", vitePreprocessor());
      await addCucumberPreprocessorPlugin(on,config);

      on(
          "file:preprocessor",
          createBundler({
            plugins: [createEsbuildPlugin(config)],
          })
      );
      return config;

    },
  },
  //
  // component: {
  //   devServer: {
  //     framework: "react",
  //     bundler: "vite",
  //   },
  // },
});

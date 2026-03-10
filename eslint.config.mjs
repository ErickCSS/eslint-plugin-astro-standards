import astro from "eslint-plugin-astro";
import jsxA11y from "eslint-plugin-jsx-a11y";
import unusedImports from "eslint-plugin-unused-imports";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import companyAstro from "./dist/plugin.js";

export default [
  ...astro.configs.recommended,
  ...astro.configs["jsx-a11y-strict"],
  {
    files: ["src/pages/**/*.astro"],
    plugins: {
      astro,
      "jsx-a11y": jsxA11y,
      "unused-imports": unusedImports,
      "simple-import-sort": simpleImportSort,
      "company-astro": companyAstro
    },
    rules: {
      "company-astro/no-raw-html-shell-in-pages": "error",
      "company-astro/require-base-layout-in-pages": [
        "error",
        {
          layoutName: "BaseLayout",
          layoutFile: "BaseLayout.astro"
        }
      ],
      "company-astro/require-layout-seo-props": [
        "error",
        {
          layoutName: "BaseLayout",
          requiredProps: ["title", "description"]
        }
      ],
      "prefer-const": "error",
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      "no-duplicate-imports": "error",
      "unused-imports/no-unused-imports": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error"
    }
  }
];

import astro from "eslint-plugin-astro";
import jsxA11y from "eslint-plugin-jsx-a11y";
import companyAstro from "./dist/plugin.js";

export default [
  ...astro.configs.recommended,
  ...astro.configs["jsx-a11y-strict"],
  {
    files: ["src/pages/**/*.astro"],
    plugins: {
      astro,
      "jsx-a11y": jsxA11y,
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
      ]
    }
  }
];

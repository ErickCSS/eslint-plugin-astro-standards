import type { ESLint, Linter } from "eslint";
import noRawHtmlShellInPages from "./rules/no-raw-html-shell-in-pages.js";
import requireBaseLayoutInPages from "./rules/require-base-layout-in-pages.js";
import requireLayoutSeoProps from "./rules/require-layout-seo-props.js";

const plugin: ESLint.Plugin = {
  rules: {
    "no-raw-html-shell-in-pages": noRawHtmlShellInPages,
    "require-base-layout-in-pages": requireBaseLayoutInPages,
    "require-layout-seo-props": requireLayoutSeoProps,
  },
  configs: {
    recommended: {
      files: ["src/pages/**/*.astro"],
      rules: {
        "astro-standards/no-raw-html-shell-in-pages": "error",
        "astro-standards/require-base-layout-in-pages": [
          "error",
          {
            layoutName: "BaseLayout",
            layoutFile: "BaseLayout.astro",
          },
        ],
        "astro-standards/require-layout-seo-props": [
          "error",
          {
            layoutName: "BaseLayout",
            requiredProps: ["title", "description"],
          },
        ],
      },
    } as Linter.FlatConfig,
  },
};

export default plugin;

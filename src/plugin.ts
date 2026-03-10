import type { ESLint, Linter } from "eslint";
import noRawHtmlShellInPages from "./rules/no-raw-html-shell-in-pages.js";
import requireBaseLayoutInPages from "./rules/require-base-layout-in-pages.js";
import requireLayoutSeoProps from "./rules/require-layout-seo-props.js";
import requireHeadingHierarchy from "./rules/require-heading-hierarchy.js";
import requirePascalcaseComponents from "./rules/require-pascalcase-components.js";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";

const plugin: ESLint.Plugin = {
  rules: {
    "no-raw-html-shell-in-pages": noRawHtmlShellInPages,
    "require-base-layout-in-pages": requireBaseLayoutInPages,
    "require-layout-seo-props": requireLayoutSeoProps,
    "require-heading-hierarchy": requireHeadingHierarchy,
    "require-pascalcase-components": requirePascalcaseComponents,
  },
  configs: {},
};

const recommended: Linter.FlatConfig = {
  files: ["src/pages/**/*.astro"],
  plugins: {
    "astro-standards": plugin,
    "unused-imports": unusedImportsPlugin,
    "simple-import-sort": simpleImportSortPlugin,
    "jsx-a11y": jsxA11yPlugin,
  },
  rules: {
    "prefer-const": "error",
    eqeqeq: ["error", "always"],
    curly: ["error", "all"],
    "no-duplicate-imports": "error",
    "unused-imports/no-unused-imports": "error",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "astro-standards/no-raw-html-shell-in-pages": "error",
    "astro-standards/require-base-layout-in-pages": [
      "error",
      {
        layoutName: "Layout",
        layoutFile: "Layout.astro",
      },
    ],
    "astro-standards/require-layout-seo-props": [
      "error",
      {
        layoutName: "Layout",
        requiredProps: ["title", "description"],
      },
    ],
    "astro-standards/require-heading-hierarchy": "error",
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/anchor-has-content": "error",
    "jsx-a11y/anchor-is-valid": "error",
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/aria-unsupported-elements": "error",
    "jsx-a11y/heading-has-content": "error",
    "jsx-a11y/html-has-lang": "error",
    "jsx-a11y/img-redundant-alt": "error",
  },
};

const components: Linter.FlatConfig = {
  files: ["src/components/**/*.astro"],
  ignores: [
    "src/components/**/utils/**",
    "src/components/**/libs/**",
    "src/components/**/config/**",
  ],
  plugins: {
    "astro-standards": plugin,
  },
  rules: {
    "astro-standards/require-pascalcase-components": "error",
  },
};

plugin.configs!.recommended = recommended;
plugin.configs!.components = components;

export default plugin;

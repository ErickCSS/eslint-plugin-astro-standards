import type { ESLint } from "eslint";
import noRawHtmlShellInPages from "./rules/no-raw-html-shell-in-pages.js";
import requireBaseLayoutInPages from "./rules/require-base-layout-in-pages.js";
import requireLayoutSeoProps from "./rules/require-layout-seo-props.js";

const plugin: ESLint.Plugin = {
  rules: {
    "no-raw-html-shell-in-pages": noRawHtmlShellInPages,
    "require-base-layout-in-pages": requireBaseLayoutInPages,
    "require-layout-seo-props": requireLayoutSeoProps,
  },
};

export default plugin;

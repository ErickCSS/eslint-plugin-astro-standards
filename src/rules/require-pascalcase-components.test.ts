import { RuleTester } from "eslint";
import * as astroParser from "astro-eslint-parser";
import rule from "./require-pascalcase-components.js";

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    parser: astroParser,
  },
});

ruleTester.run("require-pascalcase-components", rule, {
  valid: [
    // PascalCase component
    {
      code: `<div>Hello</div>`,
      filename: "/src/components/HeroSection.astro",
    },
    // Single word PascalCase
    {
      code: `<div>Hello</div>`,
      filename: "/src/components/Button.astro",
    },
    // Nested PascalCase
    {
      code: `<div>Hello</div>`,
      filename: "/src/components/ui/Card.astro",
    },
    // Page file (excluded — not in src/components/)
    {
      code: `<div>Hello</div>`,
      filename: "/src/pages/about-us.astro",
    },
    // Layout file (excluded)
    {
      code: `<div>Hello</div>`,
      filename: "/src/layouts/base-layout.astro",
    },
    // Utils directory (excluded)
    {
      code: `<div>Hello</div>`,
      filename: "/src/components/utils/format-date.astro",
    },
    // Libs directory (excluded)
    {
      code: `<div>Hello</div>`,
      filename: "/src/components/libs/analytics.astro",
    },
    // Config directory (excluded)
    {
      code: `<div>Hello</div>`,
      filename: "/src/components/config/settings.astro",
    },
    // Multi-word PascalCase
    {
      code: `<div>Hello</div>`,
      filename: "/src/components/NavigationBar.astro",
    },
  ],
  invalid: [
    // kebab-case component
    {
      code: `<div>Hello</div>`,
      filename: "/src/components/hero-section.astro",
      errors: [{ messageId: "notPascalCase" }],
    },
    // snake_case component
    {
      code: `<div>Hello</div>`,
      filename: "/src/components/hero_section.astro",
      errors: [{ messageId: "notPascalCase" }],
    },
    // lowercase component
    {
      code: `<div>Hello</div>`,
      filename: "/src/components/button.astro",
      errors: [{ messageId: "notPascalCase" }],
    },
    // Nested kebab-case
    {
      code: `<div>Hello</div>`,
      filename: "/src/components/ui/nav-bar.astro",
      errors: [{ messageId: "notPascalCase" }],
    },
    // camelCase component
    {
      code: `<div>Hello</div>`,
      filename: "/src/components/heroSection.astro",
      errors: [{ messageId: "notPascalCase" }],
    },
  ],
});

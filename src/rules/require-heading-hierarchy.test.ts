import { RuleTester } from "eslint";
import * as astroParser from "astro-eslint-parser";
import rule from "./require-heading-hierarchy.js";

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    parser: astroParser,
  },
});

ruleTester.run("require-heading-hierarchy", rule, {
  valid: [
    // Page with correct single h1 and proper hierarchy
    {
      code: `---
import BaseLayout from "../layouts/BaseLayout.astro";
---
<BaseLayout title="Home" description="Home page">
  <h1>Welcome</h1>
  <h2>Section</h2>
  <h3>Subsection</h3>
</BaseLayout>`,
      filename: "/src/pages/index.astro",
    },
    // Page with no h1 but uses an imported component (PascalCase) that may contain h1
    {
      code: `---
import BaseLayout from "../layouts/BaseLayout.astro";
import Hero from "../components/Hero.astro";
---
<BaseLayout title="Home" description="Home page">
  <Hero />
  <h2>Section</h2>
</BaseLayout>`,
      filename: "/src/pages/with-hero.astro",
    },
    // Page with no h1 but uses multiple imported components
    {
      code: `---
import BaseLayout from "../layouts/BaseLayout.astro";
import PageHeader from "../components/PageHeader.astro";
---
<BaseLayout title="About" description="About page">
  <PageHeader title="About Us" />
  <h2>Our Team</h2>
  <h3>Members</h3>
</BaseLayout>`,
      filename: "/src/pages/about.astro",
    },
    // Non-page file should be ignored
    {
      code: `<div><h3>No h1 here</h3></div>`,
      filename: "/src/components/Card.astro",
    },
    // Page with h1 and sequential levels going back up
    {
      code: `---
---
<h1>Title</h1>
<h2>Section A</h2>
<h3>Detail</h3>
<h2>Section B</h2>`,
      filename: "/src/pages/multi-section.astro",
    },
  ],
  invalid: [
    // Page with no h1 and no imported components
    {
      code: `---
---
<h2>Missing h1</h2>
<h3>Subsection</h3>`,
      filename: "/src/pages/no-h1.astro",
      errors: [{ messageId: "singleH1" }],
    },
    // Page with multiple h1 tags
    {
      code: `---
---
<h1>First</h1>
<h2>Section</h2>
<h1>Second</h1>`,
      filename: "/src/pages/duplicate-h1.astro",
      errors: [{ messageId: "singleH1" }],
    },
    // Page with skipped heading levels
    {
      code: `---
---
<h1>Title</h1>
<h3>Skipped h2</h3>`,
      filename: "/src/pages/skipped.astro",
      errors: [{ messageId: "skippedLevel" }],
    },
    // Page with multiple h1 even when using imported components
    {
      code: `---
import Hero from "../components/Hero.astro";
---
<Hero />
<h1>First</h1>
<h1>Second</h1>`,
      filename: "/src/pages/multi-h1-with-component.astro",
      errors: [{ messageId: "singleH1" }],
    },
    // Page with no h1 and no components (only lowercase HTML tags)
    {
      code: `---
---
<div>
  <h2>No heading</h2>
  <p>Content</p>
</div>`,
      filename: "/src/pages/plain-no-h1.astro",
      errors: [{ messageId: "singleH1" }],
    },
  ],
});

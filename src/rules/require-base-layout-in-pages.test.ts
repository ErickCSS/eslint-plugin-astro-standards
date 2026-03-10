import { RuleTester } from "eslint";
import { describe, it } from "vitest";
import rule from "./require-base-layout-in-pages.js";

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
});

describe("require-base-layout-in-pages", () => {
  it("should pass valid tests and fail invalid tests", () => {
    ruleTester.run("require-base-layout-in-pages", rule, {
      valid: [
        {
          code: `---
import BaseLayout from "../layouts/BaseLayout.astro";
---
<BaseLayout title="Home" description="Home page">
  <h1>Welcome</h1>
</BaseLayout>`,
          filename: "src/pages/index.astro",
        },
        {
          code: `---
import BaseLayout from "~/layouts/BaseLayout.astro";
const title = "About";
---
<BaseLayout title={title} description="About page">
  <p>Content</p>
</BaseLayout>`,
          filename: "src/pages/about.astro",
        },
        {
          code: `---
import MainLayout from "../layouts/MainLayout.astro";
---
<MainLayout title="Custom" description="Custom layout">
  <h1>Custom</h1>
</MainLayout>`,
          filename: "src/pages/custom.astro",
          options: [{ layoutName: "MainLayout", layoutFile: "MainLayout.astro" }],
        },
        {
          code: `<div>No layout needed</div>`,
          filename: "src/components/Component.astro",
        },
      ],
      invalid: [
        {
          code: `---
---
<div>
  <h1>No layout</h1>
</div>`,
          filename: "src/pages/nolayout.astro",
          errors: [
            { messageId: "missingImport" },
            { messageId: "missingUsage" },
          ],
        },
        {
          code: `---
import BaseLayout from "../layouts/BaseLayout.astro";
---
<div>
  <h1>Imported but not used</h1>
</div>`,
          filename: "src/pages/notused.astro",
          errors: [{ messageId: "missingUsage" }],
        },
        {
          code: `---
const title = "Test";
---
<BaseLayout title={title} description="Test">
  <h1>Used but not imported</h1>
</BaseLayout>`,
          filename: "src/pages/notimported.astro",
          errors: [{ messageId: "missingImport" }],
        },
        {
          code: `---
import MainLayout from "../layouts/MainLayout.astro";
---
<MainLayout title="Wrong" description="Wrong layout">
  <h1>Wrong layout</h1>
</MainLayout>`,
          filename: "src/pages/wrong.astro",
          errors: [
            { messageId: "missingImport" },
            { messageId: "missingUsage" },
          ],
        },
      ],
    });
  });
});

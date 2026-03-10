import { RuleTester } from "eslint";
import { describe, it } from "vitest";
import rule from "./require-layout-seo-props.js";

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
});

describe("require-layout-seo-props", () => {
  it("should pass valid tests and fail invalid tests", () => {
    ruleTester.run("require-layout-seo-props", rule, {
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
import BaseLayout from "../layouts/BaseLayout.astro";
const title = "About";
const description = "About page";
---
<BaseLayout title={title} description={description}>
  <p>Content</p>
</BaseLayout>`,
          filename: "src/pages/about.astro",
        },
        {
          code: `---
import MainLayout from "../layouts/MainLayout.astro";
---
<MainLayout title="Custom" description="Custom page" ogImage="/og.png">
  <h1>Custom</h1>
</MainLayout>`,
          filename: "src/pages/custom.astro",
          options: [{ layoutName: "MainLayout", requiredProps: ["title", "description", "ogImage"] }],
        },
        {
          code: `<div>No layout</div>`,
          filename: "src/pages/nolayout.astro",
        },
        {
          code: `<BaseLayout>No props needed</BaseLayout>`,
          filename: "src/components/Component.astro",
        },
      ],
      invalid: [
        {
          code: `---
import BaseLayout from "../layouts/BaseLayout.astro";
---
<BaseLayout>
  <h1>Missing both props</h1>
</BaseLayout>`,
          filename: "src/pages/missing-both.astro",
          errors: [
            { messageId: "missingProp", data: { layoutName: "BaseLayout", propName: "title" } },
            { messageId: "missingProp", data: { layoutName: "BaseLayout", propName: "description" } },
          ],
        },
        {
          code: `---
import BaseLayout from "../layouts/BaseLayout.astro";
---
<BaseLayout title="Only title">
  <h1>Missing description</h1>
</BaseLayout>`,
          filename: "src/pages/missing-desc.astro",
          errors: [
            { messageId: "missingProp", data: { layoutName: "BaseLayout", propName: "description" } },
          ],
        },
        {
          code: `---
import BaseLayout from "../layouts/BaseLayout.astro";
---
<BaseLayout description="Only description">
  <h1>Missing title</h1>
</BaseLayout>`,
          filename: "src/pages/missing-title.astro",
          errors: [
            { messageId: "missingProp", data: { layoutName: "BaseLayout", propName: "title" } },
          ],
        },
        {
          code: `---
import MainLayout from "../layouts/MainLayout.astro";
---
<MainLayout title="Test" description="Test page">
  <h1>Missing ogImage</h1>
</MainLayout>`,
          filename: "src/pages/missing-og.astro",
          options: [{ layoutName: "MainLayout", requiredProps: ["title", "description", "ogImage"] }],
          errors: [
            { messageId: "missingProp", data: { layoutName: "MainLayout", propName: "ogImage" } },
          ],
        },
      ],
    });
  });
});

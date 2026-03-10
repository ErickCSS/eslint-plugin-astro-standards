import { RuleTester } from "eslint";
import { describe, it } from "vitest";
import rule from "./no-raw-html-shell-in-pages.js";

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
});

describe("no-raw-html-shell-in-pages", () => {
  it("should pass valid tests and fail invalid tests", () => {
    ruleTester.run("no-raw-html-shell-in-pages", rule, {
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
const title = "About";
---
<div>
  <h1>About Page</h1>
  <p>This is valid content</p>
</div>`,
          filename: "src/pages/about.astro",
        },
        {
          code: `<html><head><body>This is fine</body></head></html>`,
          filename: "src/components/Component.astro",
        },
        {
          code: `<html><head><body>This is fine</body></head></html>`,
          filename: "src/layouts/BaseLayout.astro",
        },
      ],
      invalid: [
        {
          code: `---
---
<html>
  <head>
    <title>Bad</title>
  </head>
  <body>
    <h1>Content</h1>
  </body>
</html>`,
          filename: "src/pages/bad.astro",
          errors: [
            { messageId: "noHtml" },
            { messageId: "noHead" },
            { messageId: "noBody" },
          ],
        },
        {
          code: `---
---
<html lang="en">
  <h1>Content</h1>
</html>`,
          filename: "src/pages/test.astro",
          errors: [{ messageId: "noHtml" }],
        },
        {
          code: `---
---
<head>
  <meta charset="utf-8" />
</head>`,
          filename: "src/pages/meta.astro",
          errors: [{ messageId: "noHead" }],
        },
        {
          code: `---
---
<body>
  <h1>Content</h1>
</body>`,
          filename: "src/pages/content.astro",
          errors: [{ messageId: "noBody" }],
        },
      ],
    });
  });
});

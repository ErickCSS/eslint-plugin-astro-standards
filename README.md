# eslint-plugin-astro-standards

Custom ESLint plugin that extends `eslint-plugin-astro` to enforce best practices in Astro projects.

## 🎯 Goal

Ensure all Astro pages follow a consistent pattern:

- Mandatory use of a base layout
- Prohibition of structural HTML tags (`<html>`, `<head>`, `<body>`) in pages
- Mandatory SEO through props (`title`, `description`)

## 📦 Installation

### If you already have an Astro project with ESLint configured:

```bash
pnpm add -D eslint-plugin-astro-standards
```

### If you're starting from scratch:

```bash
pnpm add -D eslint eslint-plugin-astro eslint-plugin-astro-standards
```

Or with npm:

```bash
npm install -D eslint eslint-plugin-astro eslint-plugin-astro-standards
```

> **Note:** The plugin automatically installs `@typescript-eslint/parser` as a dependency. You only need to have `eslint` and `eslint-plugin-astro` installed beforehand.

## ⚙️ Configuration

Create or update your `eslint.config.mjs`:

```js
import astro from "eslint-plugin-astro";
import astroStandards from "eslint-plugin-astro-standards";

export default [
  ...astro.configs.recommended,
  {
    files: ["src/pages/**/*.astro"],
    plugins: {
      "astro-standards": astroStandards,
    },
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
  },
];
```

> **Optional:** If you also want strict accessibility rules, you can add `eslint-plugin-jsx-a11y` and use `...astro.configs["jsx-a11y-strict"]`.

## 📋 Rules

### `no-raw-html-shell-in-pages`

Disallows the use of `<html>`, `<head>`, and `<body>` in Astro page files.

**❌ Incorrect:**

```astro
---
---

<html>
  <head>
    <title>My page</title>
  </head>
  <body>
    <h1>Hello world</h1>
  </body>
</html>
```

**✅ Correct:**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout title="My page" description="My page description">
  <h1>Hello world</h1>
</BaseLayout>
```

**Reason:** The HTML structure should live in the base layout to maintain consistency and facilitate global changes.

---

### `require-base-layout-in-pages`

Requires all pages to import and use a specific layout.

**Options:**

```js
{
  layoutName: "BaseLayout",  // Layout component name (default: "BaseLayout")
  layoutFile: "BaseLayout.astro"  // File name (default: "BaseLayout.astro")
}
```

**❌ Incorrect:**

```astro
---
---

<main>
  <h1>Page without layout</h1>
</main>
```

**✅ Correct:**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout title="Home" description="Main page">
  <main>
    <h1>Page with layout</h1>
  </main>
</BaseLayout>
```

**Reason:** Ensures all pages have a consistent HTML structure and proper SEO.

---

### `require-layout-seo-props`

Requires specific props (by default `title` and `description`) to be passed to the layout.

**Options:**

```js
{
  layoutName: "BaseLayout",  // Layout name to verify (default: "BaseLayout")
  requiredProps: ["title", "description"]  // Required props (default: ["title", "description"])
}
```

**❌ Incorrect:**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout>
  <h1>Without SEO</h1>
</BaseLayout>
```

**✅ Correct:**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout title="Home" description="Main page">
  <h1>With SEO</h1>
</BaseLayout>
```

**Reason:** Ensures all pages have basic SEO metadata.

---

## 🏗️ Base Layout Example

```astro
---
interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props as Props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
  </head>
  <body>
    <slot />
  </body>
</html>
```

## 🚀 Recommended Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "lint:astro-pages": "eslint src/pages/**/*.astro"
  }
}
```

## 🔧 Customization

You can adjust the rules according to your needs:

```js
{
  rules: {
    // Change the layout name
    "astro-standards/require-base-layout-in-pages": [
      "error",
      {
        layoutName: "MainLayout",
        layoutFile: "MainLayout.astro"
      }
    ],

    // Add more required props
    "astro-standards/require-layout-seo-props": [
      "error",
      {
        layoutName: "BaseLayout",
        requiredProps: ["title", "description", "ogImage"]
      }
    ],

    // Disable a specific rule
    "astro-standards/no-raw-html-shell-in-pages": "off"
  }
}
```

## 🤝 Contributing

This is a personal plugin, but if you find bugs or have suggestions, feel free to open an issue.

## 📄 License

MIT

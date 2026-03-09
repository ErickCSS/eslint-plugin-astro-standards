# Astro ESLint Standards — Plugin + Config

Guía completa para crear un **plugin ESLint personalizado** que extiende `eslint-plugin-astro` y obliga buenas prácticas en proyectos Astro:

- Uso obligatorio de `BaseLayout`
- Prohibido `<html>`, `<head>`, `<body>` en páginas
- SEO obligatorio vía props (`title`, `description`)
- Extensible con más reglas

---

# 1. Instalar dependencias

```bash
pnpm add -D eslint eslint-plugin-astro eslint-plugin-jsx-a11y
```

## Estructura del proyecto

project/
eslint/
rules/
no-raw-html-shell-in-pages.js
require-base-layout-in-pages.js
require-layout-seo-props.js
plugin.js
src/
layouts/
BaseLayout.astro
pages/
index.astro
eslint.config.mjs
package.json

## 2. Crear el plugin

import noRawHtmlShellInPages from "./rules/no-raw-html-shell-in-pages.js";
import requireBaseLayoutInPages from "./rules/require-base-layout-in-pages.js";
import requireLayoutSeoProps from "./rules/require-layout-seo-props.js";

export default {
rules: {
"no-raw-html-shell-in-pages": noRawHtmlShellInPages,
"require-base-layout-in-pages": requireBaseLayoutInPages,
"require-layout-seo-props": requireLayoutSeoProps,
},
};

### Regla: no-raw-html-shell-in-pages.js

export default {
meta: {
type: "problem",
docs: {
description:
"Disallow <html>, <head>, and <body> tags inside Astro page files",
},
schema: [],
messages: {
noHtml:
"No uses <html> en páginas Astro. Esa estructura debe vivir en el layout base.",
noHead:
"No uses <head> en páginas Astro. La metadata debe pasar por props al layout.",
noBody:
"No uses <body> en páginas Astro. El layout base debe controlar esa estructura.",
},
},

create(context) {
const filename = context.filename || "";

    const isPage =
      filename.endsWith(".astro") &&
      (filename.includes("/src/pages/") || filename.includes("\\src\\pages\\"));

    if (!isPage) return {};

    return {
      Program(node) {
        const source = context.sourceCode.getText();

        const checks = [
          { regex: /<html[\s>]/i, messageId: "noHtml" },
          { regex: /<head[\s>]/i, messageId: "noHead" },
          { regex: /<body[\s>]/i, messageId: "noBody" },
        ];

        for (const check of checks) {
          const match = check.regex.exec(source);
          if (!match) continue;

          const loc = context.sourceCode.getLocFromIndex(match.index);

          context.report({
            node,
            loc: { start: loc, end: loc },
            messageId: check.messageId,
          });
        }
      },
    };

},
};

### Regla: require-main-layout-in-pages.js

export default {
meta: {
type: "problem",
docs: {
description: "Require Astro pages to use BaseLayout.astro",
},
schema: [
{
type: "object",
properties: {
layoutName: { type: "string" },
layoutFile: { type: "string" },
},
additionalProperties: false,
},
],
messages: {
missingImport:
"Toda página Astro debe importar '{{layoutName}}' desde '{{layoutFile}}'.",
missingUsage:
"Toda página Astro debe usar '{{layoutName}}' como wrapper principal.",
},
},

create(context) {
const filename = context.filename || "";

    const isPage =
      filename.endsWith(".astro") &&
      (filename.includes("/src/pages/") || filename.includes("\\src\\pages\\"));

    if (!isPage) return {};

    const [
      { layoutName = "Layout", layoutFile = "main.astro" } = {},
    ] = context.options;

    return {
      Program(node) {
        const source = context.sourceCode.getText();

        const importRegex = new RegExp(
          `import\\s+${layoutName}\\s+from\\s+["'][^"']*${layoutFile.replace(".", "\\.")}["']`,
          "m"
        );

        const usageRegex = new RegExp(`<${layoutName}[\\s>]`, "m");

        if (!importRegex.test(source)) {
          context.report({
            node,
            messageId: "missingImport",
            data: { layoutName, layoutFile },
          });
        }

        if (!usageRegex.test(source)) {
          context.report({
            node,
            messageId: "missingUsage",
            data: { layoutName },
          });
        }
      },
    };

},
};

### Regla: require-layout-seo-props.js

export default {
meta: {
type: "problem",
docs: {
description: "Require SEO props on BaseLayout usage in Astro pages",
},
schema: [
{
type: "object",
properties: {
layoutName: { type: "string" },
requiredProps: {
type: "array",
items: { type: "string" },
},
},
additionalProperties: false,
},
],
messages: {
missingProp:
"El layout '{{layoutName}}' debe recibir la prop '{{propName}}'.",
},
},

create(context) {
const filename = context.filename || "";

    const isPage =
      filename.endsWith(".astro") &&
      (filename.includes("/src/pages/") || filename.includes("\\src\\pages\\"));

    if (!isPage) return {};

    const [
      { layoutName = "BaseLayout", requiredProps = ["title", "description"] } = {},
    ] = context.options;

    return {
      Program(node) {
        const source = context.sourceCode.getText();

        const layoutMatch = new RegExp(
          `<${layoutName}\\b([\\s\\S]*?)>`,
          "m"
        ).exec(source);

        if (!layoutMatch) return;

        const openingTag = layoutMatch[0];

        for (const propName of requiredProps) {
          const propRegex = new RegExp(`\\b${propName}\\s*=`, "m");

          if (!propRegex.test(openingTag)) {
            context.report({
              node,
              messageId: "missingProp",
              data: { layoutName, propName },
            });
          }
        }
      },
    };

},
};

### Config Eslint:

import astro from "eslint-plugin-astro";
import jsxA11y from "eslint-plugin-jsx-a11y";
import companyAstro from "./eslint/plugin.js";

export default [
...astro.configs.recommended,
...astro.configs["jsx-a11y-strict"],

{
files: ["src/pages/**/*.astro"],
plugins: {
astro,
"jsx-a11y": jsxA11y,
"company-astro": companyAstro,
},
rules: {
"company-astro/no-raw-html-shell-in-pages": "error",

      "company-astro/require-base-layout-in-pages": [
        "error",
        {
          layoutName: "BaseLayout",
          layoutFile: "BaseLayout.astro",
        },
      ],

      "company-astro/require-layout-seo-props": [
        "error",
        {
          layoutName: "BaseLayout",
          requiredProps: ["title", "description"],
        },
      ],
    },

},
];

#### Pagina de ejemplo Correcta:

---

## import Layout from "../layouts/main.astro";

<Layout
title="Inicio"
description="Página principal"

>

  <main>
    <h1>Hola mundo</h1>
  </main>
</Layout>

#### Pagina de ejemplo Incorrecta:

---

<html>
  <head>
    <title>Inicio</title>
  </head>
  <body>
    <h1>Hola mundo</h1>
  </body>
</html>

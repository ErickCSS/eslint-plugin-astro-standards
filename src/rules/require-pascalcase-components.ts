import type { Rule } from "eslint";

const EXCLUDED_DIRS = /[\\/](?:utils|libs|config)[\\/]/;
const PASCAL_CASE = /^[A-Z][A-Za-z0-9]*$/;

function isComponentFile(filename: string): boolean {
  if (!filename || typeof filename !== "string") {return false;}
  return (
    filename.endsWith(".astro") &&
    /[\\/]src[\\/]components[\\/]/.test(filename) &&
    !EXCLUDED_DIRS.test(filename)
  );
}

function getBaseName(filename: string): string {
  const parts = filename.replace(/\\/g, "/").split("/");
  const file = parts[parts.length - 1];
  return file.replace(/\.astro$/, "");
}

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Require PascalCase naming for Astro component files inside src/components/",
    },
    schema: [],
    messages: {
      notPascalCase:
        'Component file "{{filename}}" must use PascalCase naming (e.g. "{{expected}}").',
    },
  },

  create(context) {
    const filename = context.filename ?? context.getFilename?.() ?? "";
    if (!isComponentFile(filename)) {return {};}

    const baseName = getBaseName(filename);
    if (PASCAL_CASE.test(baseName)) {return {};}

    return {
      Program(node) {
        const expected = baseName
          .split(/[-_]+/)
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join("");

        context.report({
          node,
          messageId: "notPascalCase",
          data: {
            filename: `${baseName}.astro`,
            expected: `${expected}.astro`,
          },
        });
      },
    };
  },
};

export default rule;

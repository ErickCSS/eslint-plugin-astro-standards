import { getSourceCode, isAstroPageFile } from "./utils.js";

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Require Astro pages to use BaseLayout.astro"
    },
    schema: [
      {
        type: "object",
        properties: {
          layoutName: { type: "string" },
          layoutFile: { type: "string" }
        },
        additionalProperties: false
      }
    ],
    messages: {
      missingImport: "Every Astro page must import '{{layoutName}}' from '{{layoutFile}}'.",
      missingUsage: "Every Astro page must use '{{layoutName}}' as the main wrapper."
    }
  },

  create(context) {
    const filename = context.filename ?? context.getFilename?.() ?? "";
    if (!isAstroPageFile(filename)) return {};

    const [{ layoutName = "BaseLayout", layoutFile = "BaseLayout.astro" } = {}] = context.options;

    return {
      Program(node) {
        const source = getSourceCode(context).getText();
        const safeLayoutName = escapeRegExp(layoutName);
        const safeLayoutFile = escapeRegExp(layoutFile);

        const importRegex = new RegExp(
          `import\\s+${safeLayoutName}\\s+from\\s+["'][^"']*${safeLayoutFile}["']`,
          "m"
        );
        const usageRegex = new RegExp(`<${safeLayoutName}[\\s>]`, "m");

        if (!importRegex.test(source)) {
          context.report({
            node,
            messageId: "missingImport",
            data: { layoutName, layoutFile }
          });
        }

        if (!usageRegex.test(source)) {
          context.report({
            node,
            messageId: "missingUsage",
            data: { layoutName }
          });
        }
      }
    };
  }
};

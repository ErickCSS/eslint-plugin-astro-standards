import { getSourceCode, isAstroPageFile } from "./utils.js";

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Require SEO props on BaseLayout usage in Astro pages"
    },
    schema: [
      {
        type: "object",
        properties: {
          layoutName: { type: "string" },
          requiredProps: {
            type: "array",
            items: { type: "string" }
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      missingProp: "The layout '{{layoutName}}' must receive the prop '{{propName}}'."
    }
  },

  create(context) {
    const filename = context.filename ?? context.getFilename?.() ?? "";
    if (!isAstroPageFile(filename)) return {};

    const [{ layoutName = "BaseLayout", requiredProps = ["title", "description"] } = {}] = context.options;

    return {
      Program(node) {
        const source = getSourceCode(context).getText();
        const safeLayoutName = escapeRegExp(layoutName);
        const layoutMatch = new RegExp(`<${safeLayoutName}\\b([\\s\\S]*?)>`, "m").exec(source);
        if (!layoutMatch) return;

        const openingTag = layoutMatch[0];
        for (const propName of requiredProps) {
          const safePropName = escapeRegExp(propName);
          const propRegex = new RegExp(`\\b${safePropName}\\s*=`, "m");
          if (!propRegex.test(openingTag)) {
            context.report({
              node,
              messageId: "missingProp",
              data: { layoutName, propName }
            });
          }
        }
      }
    };
  }
};

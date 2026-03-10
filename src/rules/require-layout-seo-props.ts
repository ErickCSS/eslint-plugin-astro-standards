import type { Rule } from "eslint";
import { getSourceCode, isAstroPageFile } from "./utils.js";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

interface RuleOptions {
  layoutName?: string;
  requiredProps?: string[];
}

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Require SEO props on Layout usage in Astro pages",
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
        "The layout '{{layoutName}}' must receive the prop '{{propName}}'.",
    },
  },

  create(context) {
    const filename = context.filename ?? context.getFilename?.() ?? "";
    if (!isAstroPageFile(filename)) {
      return {};
    }

    const [
      {
        layoutName = "Layout",
        requiredProps = ["title", "description"],
      } = {} as RuleOptions,
    ] = context.options as RuleOptions[];

    return {
      Program(node) {
        const source = getSourceCode(context).getText();
        const safeLayoutName = escapeRegExp(layoutName);
        const layoutMatch = new RegExp(
          `<${safeLayoutName}\\b([\\s\\S]*?)>`,
          "m",
        ).exec(source);
        if (!layoutMatch) {
          return;
        }

        const openingTag = layoutMatch[0];
        for (const propName of requiredProps!) {
          const safePropName = escapeRegExp(propName);
          const propRegex = new RegExp(`\\b${safePropName}\\s*=`, "m");
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

export default rule;

import type { Rule } from "eslint";
import { getSourceCode, isAstroPageFile } from "./utils.js";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow <html>, <head>, and <body> tags inside Astro page files",
    },
    schema: [],
    messages: {
      noHtml:
        "Do not use <html> in Astro pages. This structure should live in the base layout.",
      noHead:
        "Do not use <head> in Astro pages. Metadata should be passed via props to the layout.",
      noBody:
        "Do not use <body> in Astro pages. The base layout should control this structure.",
    },
  },

  create(context) {
    const filename = context.filename ?? context.getFilename?.() ?? "";
    if (!isAstroPageFile(filename)) return {};

    return {
      Program(node) {
        const sourceCode = getSourceCode(context);
        const source = sourceCode.getText();

        const checks = [
          { regex: /<html[\s>]/i, messageId: "noHtml" },
          { regex: /<head[\s>]/i, messageId: "noHead" },
          { regex: /<body[\s>]/i, messageId: "noBody" },
        ] as const;

        for (const check of checks) {
          const match = check.regex.exec(source);
          if (!match) continue;

          const loc = sourceCode.getLocFromIndex(match.index);
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

export default rule;

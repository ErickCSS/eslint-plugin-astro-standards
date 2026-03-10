import type { Rule } from "eslint";
import { getSourceCode, isAstroPageFile } from "./utils.js";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Require a correct heading hierarchy in Astro page files (single h1, no skipped levels)",
    },
    schema: [],
    messages: {
      singleH1: "Each Astro page must have exactly one <h1>. Found {{count}}.",
      skippedLevel:
        "Heading level skipped: <h{{found}}> after <h{{previous}}>. Expected <h{{expected}}> or lower.",
    },
  },

  create(context) {
    const filename = context.filename ?? context.getFilename?.() ?? "";
    if (!isAstroPageFile(filename)) {
      return {};
    }

    return {
      Program(node) {
        const sourceCode = getSourceCode(context);
        const source = sourceCode.getText();

        // Strip frontmatter (--- ... ---) so we only analyse the template
        const fmEnd = source.indexOf("---", source.indexOf("---") + 3);
        const template = fmEnd !== -1 ? source.slice(fmEnd + 3) : source;
        const templateOffset = fmEnd !== -1 ? fmEnd + 3 : 0;

        // Collect all opening heading tags
        const headingRegex = /<h([1-6])[\s>]/gi;
        const headings: { level: number; index: number }[] = [];
        let match: RegExpExecArray | null;

        while ((match = headingRegex.exec(template)) !== null) {
          headings.push({
            level: Number(match[1]),
            index: templateOffset + match.index,
          });
        }

        // Detect imported components used in the template (PascalCase tags like <Hero />, <PageHeader>)
        // These components may contain headings internally, so we can't enforce h1 presence
        const componentTagRegex = /<([A-Z][A-Za-z0-9]*)[\s/>]/g;
        let hasImportedComponents = false;
        while (componentTagRegex.exec(template) !== null) {
          hasImportedComponents = true;
          break;
        }

        // Rule 1: exactly one <h1>
        const h1Count = headings.filter((h) => h.level === 1).length;
        if (h1Count !== 1) {
          if (h1Count === 0 && !hasImportedComponents) {
            context.report({
              node,
              messageId: "singleH1",
              data: { count: "0" },
            });
          } else if (h1Count > 1) {
            // Report on every h1 beyond the first one
            const h1Headings = headings.filter((h) => h.level === 1);
            for (let i = 1; i < h1Headings.length; i++) {
              const loc = sourceCode.getLocFromIndex(h1Headings[i].index);
              context.report({
                node,
                loc: { start: loc, end: loc },
                messageId: "singleH1",
                data: { count: String(h1Count) },
              });
            }
          }
        }

        // Rule 2: no skipped levels
        for (let i = 1; i < headings.length; i++) {
          const prev = headings[i - 1].level;
          const curr = headings[i].level;

          // Going deeper by more than 1 level is a skip
          if (curr > prev + 1) {
            const loc = sourceCode.getLocFromIndex(headings[i].index);
            context.report({
              node,
              loc: { start: loc, end: loc },
              messageId: "skippedLevel",
              data: {
                found: String(curr),
                previous: String(prev),
                expected: String(prev + 1),
              },
            });
          }
        }
      },
    };
  },
};

export default rule;

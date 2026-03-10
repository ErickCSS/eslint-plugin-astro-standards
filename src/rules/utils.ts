import type { Rule } from "eslint";

export function isAstroPageFile(filename: string): boolean {
  if (!filename || typeof filename !== "string") {return false;}
  return filename.endsWith(".astro") && /[\\/]src[\\/]pages[\\/]/.test(filename);
}

export function getSourceCode(context: Rule.RuleContext): Rule.RuleContext["sourceCode"] {
  return context.sourceCode ?? context.getSourceCode();
}

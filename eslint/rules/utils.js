export function isAstroPageFile(filename) {
  if (!filename || typeof filename !== "string") return false;
  return filename.endsWith(".astro") && /[\\/]src[\\/]pages[\\/]/.test(filename);
}

export function getSourceCode(context) {
  return context.sourceCode ?? context.getSourceCode();
}

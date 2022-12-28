class VueTsxMacroError extends Error {}

/**
 *
 * @param {import('@babel/core').NodePath} path
 * @param {string} message
 */
module.exports = function buildMacroError(path, message) {
  return path.buildCodeFrameError(message, VueTsxMacroError);
};

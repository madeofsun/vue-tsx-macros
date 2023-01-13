const resolveContext = require("../resolve-context");

/**
 * @param {babel.NodePath} path
 * @param {{
 *   emits: import("./render").RenderOptions['emits']
 * }} options
 * @returns {null | babel.types.Expression}
 */
module.exports = function renderEmits(path, options) {
  const t = resolveContext().babel.types;

  const { emits } = options;

  if (t.isExpression(emits)) {
    return emits;
  }

  if (emits === null || emits.length === 0) {
    return null;
  }

  return t.arrayExpression(emits.map((name) => t.stringLiteral(name)));
};

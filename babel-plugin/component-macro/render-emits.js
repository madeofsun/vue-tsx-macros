const babel = require("@babel/core");

const t = babel.types;

/**
 * @param {babel.NodePath} path
 * @param {{
 *   emits: import("./render").RenderOptions['emits']
 * }} options
 * @returns {null | babel.types.Expression}
 */
module.exports = function renderEmits(path, options) {
  const { emits } = options;

  if (t.isExpression(emits)) {
    return emits;
  }

  if (emits === null || emits.length === 0) {
    return null;
  }

  return t.arrayExpression(emits.map((name) => t.stringLiteral(name)));
};

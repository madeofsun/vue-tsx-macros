const babel = require("@babel/core");
const { WITH_DEFAULTS } = require("../constants");

const t = babel.types;

/**
 * @param {babel.NodePath<babel.types.CallExpression>} path
 * @returns {null | babel.types.Identifier | babel.types.ObjectExpression}
 */
module.exports = function parseDefaults(path) {
  if (!t.isMemberExpression(path.parentPath.node)) {
    return null;
  }
  const memberExpression = path.parentPath.node;
  if (!t.isIdentifier(memberExpression.property)) {
    return null;
  }
  const id = memberExpression.property;
  if (
    id.name === WITH_DEFAULTS &&
    path.parentPath.parentPath &&
    path.parentPath.parentPath.isCallExpression()
  ) {
    const callExpression = path.parentPath.parentPath.node;
    const arg = callExpression.arguments[0];
    if (t.isIdentifier(arg) || t.isObjectExpression(arg)) {
      return arg;
    }
  }
  return null;
};

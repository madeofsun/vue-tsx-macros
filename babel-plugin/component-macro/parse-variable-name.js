const babel = require("@babel/core");

const t = babel.types;

/**
 * @param {babel.NodePath<babel.types.CallExpression>} componentCallPath
 * @returns {import('./render').RenderOptions['variableName']}
 */
module.exports = function parseVariableName(componentCallPath) {
  if (
    componentCallPath.parentPath.isVariableDeclarator() &&
    t.isIdentifier(componentCallPath.parentPath.node.id)
  ) {
    return componentCallPath.parentPath.node.id.name;
  }
  return null;
};

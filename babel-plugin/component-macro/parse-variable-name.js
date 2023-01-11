const resolveBabel = require("../resolve-babel");

/**
 * @param {babel.NodePath<babel.types.CallExpression>} componentCallPath
 * @returns {import('./render').RenderOptions['variableName']}
 */
module.exports = function parseVariableName(componentCallPath) {
  const t = resolveBabel().types;

  if (
    componentCallPath.parentPath.isVariableDeclarator() &&
    t.isIdentifier(componentCallPath.parentPath.node.id)
  ) {
    return componentCallPath.parentPath.node.id.name;
  }
  return null;
};

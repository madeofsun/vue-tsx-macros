const babel = require("@babel/core");
const {
  WITH_DEFAULTS,
  STANDARD_COMPONENT,
  FUNCTIONAL_COMPONENT,
} = require("../constants");

const t = babel.types;

/**
 * @param {babel.NodePath<babel.types.CallExpression>} path
 * @returns {null | string}
 */
module.exports = function parseVariableName(path) {
  if (!path.parentPath.isMemberExpression()) {
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
    return parseVariableName(path.parentPath.parentPath);
  } else if (
    (id.name === STANDARD_COMPONENT || id.name === FUNCTIONAL_COMPONENT) &&
    path.parentPath.parentPath.parentPath &&
    path.parentPath.parentPath.parentPath.isVariableDeclarator()
  ) {
    const variableDeclarator = path.parentPath.parentPath.parentPath.node;
    if (t.isIdentifier(variableDeclarator.id)) {
      return variableDeclarator.id.name;
    }
  }
  return null;
};

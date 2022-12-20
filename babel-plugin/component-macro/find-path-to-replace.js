const babel = require("@babel/core");
const {
  WITH_DEFAULTS,
  STANDARD_COMPONENT,
  FUNCTIONAL_COMPONENT,
} = require("../constants");

const t = babel.types;

/**
 * @param {babel.NodePath<babel.types.CallExpression>} path
 * @returns {null | babel.NodePath}
 */
module.exports = function findPathToReplace(path) {
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
    return findPathToReplace(path.parentPath.parentPath);
  } else if (
    (id.name === STANDARD_COMPONENT ||
    id.name === FUNCTIONAL_COMPONENT)
    && path.parentPath.parentPath.isCallExpression()
  ) {
    return path.parentPath.parentPath
  }
  return null;
};

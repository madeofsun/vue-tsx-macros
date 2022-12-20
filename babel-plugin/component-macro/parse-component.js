const babel = require("@babel/core");
const {
  STANDARD_COMPONENT,
  FUNCTIONAL_COMPONENT,
  WITH_DEFAULTS,
} = require("../constants");

const t = babel.types;

/**
 * @param {babel.NodePath<babel.types.CallExpression>} path
 * @returns {null | {
 *  type: typeof STANDARD_COMPONENT | typeof FUNCTIONAL_COMPONENT,
 *  path: undefined | babel.NodePath<babel.types.Expression>
 * }}
 */
module.exports = function parseComponent(path) {
  if (!t.isMemberExpression(path.parentPath.node)) {
    return null;
  }
  const memberExpression = path.parentPath.node;
  if (!t.isIdentifier(memberExpression.property)) {
    return null;
  }
  const id = memberExpression.property;
  if (
    !(
      path.parentPath.parentPath &&
      path.parentPath.parentPath.isCallExpression()
    )
  ) {
    return null;
  }
  if (id.name === WITH_DEFAULTS) {
    // lvl up
    return parseComponent(path.parentPath.parentPath);
  } else if (
    id.name === STANDARD_COMPONENT ||
    id.name === FUNCTIONAL_COMPONENT
  ) {
    const arg = path.parentPath.parentPath.node.arguments[0];
    /**
     * @type {undefined | babel.NodePath<babel.types.Expression>}
     */
    let componentPath = undefined;

    path.parentPath.parentPath.traverse({
      Expression(path) {
        if (path.node === arg) {
          componentPath = path;
        }
      },
    });

    if (componentPath) {
      return {
        type: id.name,
        path: componentPath,
      };
    }
  }
  return null;
};

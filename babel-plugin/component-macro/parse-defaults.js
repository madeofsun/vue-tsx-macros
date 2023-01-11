const resolveBabel = require("../resolve-babel");
const buildMacroError = require("../helpers/build-macro-error");
const { WITH_DEFAULTS, COMPONENT_MACRO } = require("../constants");

/**
 * @param {babel.NodePath<babel.types.CallExpression>} defaultPropsCallPath
 * @returns {ReturnType<import('../helpers/build-macro-error')> | import('./render').RenderOptions['defaultProps']}
 */
module.exports = function parseDefaults(defaultPropsCallPath) {
  const t = resolveBabel().types;

  const arg = defaultPropsCallPath.node.arguments[0];

  if (arg === undefined) {
    return buildMacroError(
      defaultPropsCallPath.parentPath,
      `${COMPONENT_MACRO}: "${WITH_DEFAULTS}" argument is not provided - ${COMPONENT_MACRO}.${WITH_DEFAULTS}({ some: 'some' })`
    );
  } else if (!t.isExpression(arg)) {
    return buildMacroError(
      defaultPropsCallPath,
      `${COMPONENT_MACRO}: "${WITH_DEFAULTS}" argument is not "Expression"  - ${COMPONENT_MACRO}.${WITH_DEFAULTS}({ some: 'some' })`
    );
  }

  return arg;
};

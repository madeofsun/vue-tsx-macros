const babel = require("@babel/core");

const buildMacroError = require("../helpers/build-macro-error");
const {
  STANDARD_COMPONENT,
  FUNCTIONAL_COMPONENT,
  WITH_DEFAULTS,
  COMPONENT_MACRO,
  DOCS_LINK,
} = require("../constants");

const t = babel.types;

/**
 * @param {babel.NodePath<babel.types.CallExpression>} macroCallPath
 * @returns {ReturnType<import('../helpers/build-macro-error')> | {
 *  component: {
 *      type: typeof STANDARD_COMPONENT | typeof FUNCTIONAL_COMPONENT,
 *      path: babel.NodePath<babel.types.CallExpression>,
 *      expression: babel.types.Expression
 *  },
 *  defaultProps?: {
 *    path: babel.NodePath<babel.types.CallExpression>
 *  },
 * }}
 */
module.exports = function parseComponent(macroCallPath) {
  if (!macroCallPath.parentPath.isMemberExpression()) {
    return buildError(
      macroCallPath.parentPath,
      '"MemberExpression" is expected'
    );
  }
  const id = macroCallPath.parentPath.node.property;

  if (!t.isIdentifier(id)) {
    return buildError(macroCallPath.parentPath, '"Identifier" is expected');
  }

  if (!macroCallPath.parentPath.parentPath.isCallExpression()) {
    return buildError(
      macroCallPath.parentPath.parentPath,
      '"CallExpression" is expected'
    );
  }

  if (id.name == STANDARD_COMPONENT || id.name === FUNCTIONAL_COMPONENT) {
    const path = macroCallPath.parentPath.parentPath;

    const expression = path.node.arguments[0];

    if (expression === undefined) {
      return buildError(path, "argument is not provided");
    } else if (!t.isExpression(expression)) {
      return buildError(path, '"argument is not "Expression"');
    }

    return {
      component: {
        type: id.name,
        path,
        expression,
      },
    };
  }

  if (id.name !== WITH_DEFAULTS) {
    return buildError(
      macroCallPath.parentPath.parentPath,
      `method "${id.name}" is not supported`
    );
  }

  const defaultPropsCallPath = macroCallPath.parentPath.parentPath;

  if (!defaultPropsCallPath.parentPath.isMemberExpression()) {
    return buildError(
      defaultPropsCallPath.parentPath,
      '"MemberExpression" is expected'
    );
  }

  const outerId = defaultPropsCallPath.parentPath.node.property;
  if (!t.isIdentifier(outerId)) {
    return buildError(
      defaultPropsCallPath.parentPath,
      '"Identifier" is expected'
    );
  }

  if (!defaultPropsCallPath.parentPath.parentPath.isCallExpression()) {
    return buildError(
      defaultPropsCallPath.parentPath.parentPath,
      '"CallExpression" is expected'
    );
  }

  if (
    outerId.name !== STANDARD_COMPONENT &&
    outerId.name !== FUNCTIONAL_COMPONENT
  ) {
    return buildError(
      defaultPropsCallPath.parentPath.parentPath,
      `method "${outerId.name}" is not supported`
    );
  }

  const path = defaultPropsCallPath.parentPath.parentPath;

  const expression = path.node.arguments[0];

  if (expression === undefined) {
    return buildError(path, "argument is not provided");
  } else if (!t.isExpression(expression)) {
    return buildError(path, 'argument is not "Expression"');
  }

  return {
    component: {
      type: outerId.name,
      path,
      expression,
    },
    defaultProps: {
      path: defaultPropsCallPath,
    },
  };
};

/**
 * @param {babel.NodePath<babel.types.Node>} path
 * @param {string} expect
 */
function buildError(path, expect) {
  return buildMacroError(
    path,
    `${COMPONENT_MACRO}: Invalid macro expression - ${expect}. Consult docs for correct usage examples - ${DOCS_LINK}`
  );
}

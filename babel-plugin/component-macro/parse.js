const parseVariableName = require("./parse-variable-name");
const parseProps = require("./parse-props");
const parseEmits = require("./parse-emits");
const parseDefaults = require("./parse-defaults");
const parseComponent = require("./parse-component");

/**
 *
 * @param {import('@babel/core').NodePath<import('@babel/core').types.CallExpression>} macroCallPath
 * @returns {ReturnType<import('../helpers/build-macro-error')> | {
 *  path: import('@babel/core').NodePath<import('@babel/core').types.CallExpression>,
 *  options: Parameters<import('./render')>[1]
 * }}
 */
module.exports = function parse(macroCallPath) {
  const componentRes = parseComponent(macroCallPath);
  if (componentRes instanceof Error) {
    return componentRes;
  }

  const props = parseProps(macroCallPath);
  if (props instanceof Error) {
    return props;
  }

  const emits = parseEmits(macroCallPath);
  if (emits instanceof Error) {
    return emits;
  }

  const defaultProps = componentRes.defaultProps
    ? parseDefaults(componentRes.defaultProps.path)
    : null;
  if (defaultProps instanceof Error) {
    return defaultProps;
  }

  const variableName = parseVariableName(componentRes.component.path);

  return {
    path: componentRes.component.path,
    options: {
      component: {
        type: componentRes.component.type,
        expression: componentRes.component.expression,
      },
      props,
      emits,
      defaultProps,
      variableName,
    },
  };
};

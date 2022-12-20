const babel = require("@babel/core");
const { FUNCTIONAL_COMPONENT } = require("../constants");
const filterNot = require("../utils/filterNot");
const isNull = require("../utils/isNull");
const renderProps = require("./render-props");
const transformExpose = require("./transform-expose");

const t = babel.types;

/**
 * @typedef {{
 *  props: ReturnType<typeof import("./parse-props")>
 *  defaultProps: ReturnType<typeof import("./parse-defaults")>
 *  component: ReturnType<typeof import("./parse-component")>
 *  variableName: ReturnType<typeof import("./parse-variable-name")>
 * }} RenderOptions
 */

/**
 * @param {RenderOptions} options
 * @returns {null | babel.types.Expression}
 */
module.exports = function renderComponent(options) {
  if (!options.component) {
    return null;
  }

  const props = renderProps(options);

  const { type: componentType, path: componentPath } = options.component;

  const name =
    (componentPath?.isFunctionExpression() &&
      componentPath.node.id &&
      t.isIdentifier(componentPath.node.id) &&
      componentPath.node.id.name) ||
    options.variableName;

  if (componentPath && componentType === FUNCTIONAL_COMPONENT) {
    return t.callExpression(
      t.memberExpression(t.identifier("Object"), t.identifier("assign")),
      [
        componentPath.node,
        t.objectExpression(
          filterNot(isNull, [
            name
              ? t.objectProperty(
                  t.identifier("displayName"),
                  t.stringLiteral(name)
                )
              : null,
            props && t.objectProperty(t.identifier("props"), props),
          ])
        ),
      ]
    );
  }

  if (
    componentPath?.isArrowFunctionExpression() ||
    componentPath?.isFunctionExpression()
  ) {
    transformExpose(componentPath);
  }

  return t.objectExpression(
    filterNot(isNull, [
      name
        ? t.objectProperty(t.identifier("name"), t.stringLiteral(name))
        : null,
      props && t.objectProperty(t.identifier("props"), props),
      componentPath
        ? t.objectProperty(t.identifier("setup"), componentPath.node)
        : null,
    ])
  );
};

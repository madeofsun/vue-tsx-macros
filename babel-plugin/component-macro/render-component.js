const babel = require("@babel/core");
const { FUNCTIONAL_COMPONENT } = require("../constants");
const filterNot = require("../utils/filterNot");
const isNull = require("../utils/isNull");
const renderEmits = require("./render-emits");
const renderProps = require("./render-props");
const transformExpose = require("./transform-expose");

const t = babel.types;

/**
 * @typedef {{
 *  props: ReturnType<typeof import("./parse-props")>
 *  emits: ReturnType<typeof import("./parse-emits")>
 *  defaultProps: ReturnType<typeof import("./parse-defaults")>
 *  component: ReturnType<typeof import("./parse-component")>
 *  variableName: ReturnType<typeof import("./parse-variable-name")>
 * }} RenderOptions
 */

/**
 * @param {babel.NodePath} path
 * @param {RenderOptions} options
 * @returns {null | babel.types.Expression}
 */
module.exports = function renderComponent(path, options) {
  if (!options.component) {
    return null;
  }

  const props = renderProps(path, options);
  const emits = renderEmits(path, options);

  const { type: componentType, node: componentNode } = options.component;

  const name =
    (t.isFunctionExpression(componentNode) &&
      componentNode.id &&
      t.isIdentifier(componentNode.id) &&
      componentNode.id.name) ||
    options.variableName;

  if (componentNode && componentType === FUNCTIONAL_COMPONENT) {
    return t.callExpression(
      t.memberExpression(t.identifier("Object"), t.identifier("assign")),
      [
        componentNode,
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
    t.isArrowFunctionExpression(componentNode) ||
    t.isFunctionExpression(componentNode)
  ) {
    transformExpose(componentNode);
  }

  return t.objectExpression(
    filterNot(isNull, [
      name
        ? t.objectProperty(t.identifier("name"), t.stringLiteral(name))
        : null,
      props && t.objectProperty(t.identifier("props"), props),
      emits && t.objectProperty(t.identifier("emits"), emits),
      componentNode
        ? t.objectProperty(t.identifier("setup"), componentNode)
        : null,
    ])
  );
};

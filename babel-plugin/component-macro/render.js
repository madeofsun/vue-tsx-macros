const babel = require("@babel/core");

const { FUNCTIONAL_COMPONENT } = require("../constants");
const filterNot = require("../utils/filterNot");
const isNull = require("../utils/isNull");
const renderEmits = require("./render-emits");
const renderProps = require("./render-props");

const t = babel.types;

/**
 * @typedef {{
 *  variableName: null | string
 *  props: null | string[] | babel.types.Expression
 *  emits: null | string[] | babel.types.Expression
 *  defaultProps: null | babel.types.Expression
 *  component: {
 *    type: import('../constants')['STANDARD_COMPONENT'] | import('../constants')['FUNCTIONAL_COMPONENT'],
 *    expression: babel.types.Expression
 *  }
 * }} RenderOptions
 */

/**
 * @param {babel.NodePath} path
 * @param {RenderOptions} options
 * @returns {babel.types.Expression}
 */
module.exports = function renderComponent(path, options) {
  const props = renderProps(path, options);
  const emits = renderEmits(path, options);

  const { type: componentType, expression: componentNode } = options.component;

  const name =
    (t.isFunctionExpression(componentNode) &&
      t.isIdentifier(componentNode.id) &&
      componentNode.id.name) ||
    options.variableName;

  const commonProperties = filterNot(isNull, [
    props && t.objectProperty(t.identifier("props"), props),
    emits && t.objectProperty(t.identifier("emits"), emits),
  ]);

  if (componentNode && componentType === FUNCTIONAL_COMPONENT) {
    return t.callExpression(
      t.memberExpression(t.identifier("Object"), t.identifier("assign")),
      [
        componentNode,
        t.objectExpression(
          filterNot(isNull, [
            name === null
              ? null
              : t.objectProperty(
                  t.identifier("displayName"),
                  t.stringLiteral(name)
                ),
            ...commonProperties,
          ])
        ),
      ]
    );
  }

  return t.objectExpression(
    filterNot(isNull, [
      name === null
        ? null
        : t.objectProperty(t.identifier("name"), t.stringLiteral(name)),
      ...commonProperties,
      t.objectProperty(t.identifier("setup"), componentNode),
    ])
  );
};

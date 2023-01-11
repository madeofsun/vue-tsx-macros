const resolveBabel = require("../resolve-babel");

/**
 * @param {babel.NodePath} path
 * @param {{
 *  props: import("./render").RenderOptions['props']
 *  defaultProps: import("./render").RenderOptions['defaultProps']
 * }} options
 * @returns {null | babel.types.Expression}
 */
module.exports = function renderProps(path, options) {
  const t = resolveBabel().types;

  const { props, defaultProps } = options;

  if (t.isExpression(props)) {
    return props;
  }

  if (props === null || props.length === 0) {
    return null;
  }

  if (defaultProps !== null) {
    /** @type {babel.types.Identifier} */
    let defaultsId;

    if (t.isIdentifier(defaultProps)) {
      defaultsId = defaultProps;
    } else {
      defaultsId = path.scope.generateUidIdentifier("defaultProps");
      path.scope.push({
        id: defaultsId,
        kind: "const",
        init: defaultProps,
      });
    }

    return t.objectExpression(
      props.map((name) =>
        t.objectProperty(
          t.stringLiteral(name),
          t.objectExpression([
            t.objectProperty(t.identifier("type"), t.nullLiteral()),
            t.objectProperty(
              t.identifier("default"),
              t.memberExpression(defaultsId, t.stringLiteral(name), true)
            ),
          ])
        )
      )
    );
  }

  return t.arrayExpression(props.map((name) => t.stringLiteral(name)));
};

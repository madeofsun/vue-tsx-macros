const babel = require("@babel/core");

const t = babel.types;

/**
 * @param {babel.NodePath} path
 * @param {{
 *  props: ReturnType<typeof import("./parse-props")>
 *  defaultProps: ReturnType<typeof import("./parse-defaults")>
 * }} options
 * @returns {null | babel.types.Expression}
 */
module.exports = function renderProps(path, options) {
  const { props, defaultProps } = options;

  if (t.isExpression(props)) {
    return props;
  }

  if (props.length === 0) {
    return null;
  }

  if (defaultProps) {
    /** @type {babel.types.Identifier} */
    let defaultsId;

    if (t.isIdentifier(defaultProps)) {
      defaultsId = defaultProps;
    } else {
      const statement = path.findParent((path) => path.isStatement());
      defaultsId = path.scope.generateUidIdentifier();
      statement?.insertBefore(
        t.variableDeclaration("const", [
          t.variableDeclarator(defaultsId, defaultProps),
        ])
      );
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

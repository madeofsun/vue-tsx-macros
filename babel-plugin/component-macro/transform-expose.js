const babel = require("@babel/core");
const filterNot = require("../utils/filterNot");
const isNull = require("../utils/isNull");

const t = babel.types;

/**
 *
 * @param {babel.types.ArrowFunctionExpression
 * | babel.types.FunctionExpression} node
 * @returns {void}
 */
module.exports = function transformExpose(node) {
  if (t.isBlockStatement(node.body)) {
    const returnStatement = node.body.body[node.body.body.length - 1];
    if (
      t.isReturnStatement(returnStatement) &&
      t.isCallExpression(returnStatement.argument)
    ) {
      const callExpression = returnStatement.argument;
      if (
        t.isIdentifier(callExpression.callee) &&
        callExpression.callee.name === "expose"
      ) {
        const secondArgument = t.isExpression(callExpression.arguments[1])
          ? callExpression.arguments[1]
          : null;
        if (secondArgument) {
          returnStatement.argument = t.sequenceExpression(
            filterNot(isNull, [
              t.callExpression(t.identifier("expose"), [
                callExpression.arguments[0],
              ]),
              secondArgument,
            ])
          );
        }
      }
    }
  }
};

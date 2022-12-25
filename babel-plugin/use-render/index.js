const babel = require("@babel/core");

const { USE_RENDER_MACRO } = require("../constants");
const defineMacro = require("../define-macro");

const t = babel.types;

const useRenderMacro = defineMacro(USE_RENDER_MACRO, (path) => {
  const setupFunctionPath = path.scope.getFunctionParent()?.path;
  if (
    !setupFunctionPath ||
    (!setupFunctionPath.isArrowFunctionExpression() &&
      !setupFunctionPath.isFunctionExpression())
  ) {
    return false;
  }

  const componentPath = setupFunctionPath.parentPath;

  if (!componentPath?.isObjectExpression()) {
    return false;
  }

  if (
    !componentPath.node.properties.some(
      (property) =>
        t.isObjectProperty(property) &&
        property.value === setupFunctionPath.node &&
        t.isIdentifier(property.key) &&
        property.key.name === "setup"
    )
  ) {
    return false;
  }

  const renderFunction = path.node.arguments[0];
  if (!t.isExpression(renderFunction)) {
    path.buildCodeFrameError("Missing argument for useRender$");
    return false;
  }

  const renderFunctionId = path.scope.generateUidIdentifier("render");

  setupFunctionPath.parentPath.scope.push({
    id: renderFunctionId,
    kind: "let",
  });

  path.replaceWith(
    t.assignmentExpression("=", renderFunctionId, renderFunction)
  );

  componentPath.node.properties.push(
    t.objectMethod(
      "method",
      t.identifier("render"),
      [],
      t.blockStatement([
        t.returnStatement(t.callExpression(renderFunctionId, [])),
      ])
    )
  );

  return true;
});

module.exports = useRenderMacro;

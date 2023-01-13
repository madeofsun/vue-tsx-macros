const resolveContext = require("../resolve-context");

const buildMacroError = require("../helpers/build-macro-error");
const {
  USE_RENDER_MACRO,
  COMPONENT_MACRO,
  STANDARD_COMPONENT,
} = require("../constants");
const defineMacro = require("../define-macro");

const useRenderMacro = defineMacro(USE_RENDER_MACRO, (path) => {
  const t = resolveContext().babel.types;

  const setupFunctionPath = path.scope.getFunctionParent()?.path;
  if (
    !setupFunctionPath ||
    (!setupFunctionPath.isArrowFunctionExpression() &&
      !setupFunctionPath.isFunctionExpression())
  ) {
    return buildUsageContextError(path);
  }

  const componentPath = setupFunctionPath.parentPath;

  if (
    !componentPath?.isObjectExpression() ||
    !componentPath.node.properties.some(
      (property) =>
        t.isObjectProperty(property) &&
        property.value === setupFunctionPath.node &&
        t.isIdentifier(property.key) &&
        property.key.name === "setup"
    )
  ) {
    return buildUsageContextError(path);
  }

  const renderFunction = path.node.arguments[0];
  if (renderFunction === undefined) {
    return buildMacroError(
      path,
      `${USE_RENDER_MACRO}: argument must be provided - ${USE_RENDER_MACRO}(() => <div></div>)`
    );
  } else if (!t.isExpression(renderFunction)) {
    return buildMacroError(
      path,
      `${USE_RENDER_MACRO}: argument must be "Expression", not ${renderFunction.type} - ${USE_RENDER_MACRO}(() => <div></div>)`
    );
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

  return null;
});

module.exports = useRenderMacro;

/**
 * @param {babel.NodePath<babel.types.Node>} path
 */
function buildUsageContextError(path) {
  return buildMacroError(
    path,
    `${USE_RENDER_MACRO}: must be a used inside "setup" function of "${COMPONENT_MACRO}" macro, i.e.
const Comp = ${COMPONENT_MACRO}<Props>().${STANDARD_COMPONENT}((props) => {
  ...
  useRender$(() => <div>{props.message}</div>)
  ...
})`
  );
}

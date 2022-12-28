const babel = require("@babel/core");

const buildMacroError = require("../helpers/build-macro-error");
const { DEFAULT_PROPS_MACRO } = require("../constants");
const defineMacro = require("../define-macro");

const t = babel.types;

const defaultPropsMacro = defineMacro(DEFAULT_PROPS_MACRO, (path) => {
  if (!path.parentPath.isCallExpression()) {
    return buildMacroError(
      path,
      `${DEFAULT_PROPS_MACRO}: must be a called - ${DEFAULT_PROPS_MACRO}()({ some: value })`
    );
  }

  const arg = path.parentPath.node.arguments[0];

  if (arg === undefined) {
    return buildMacroError(
      path,
      `${DEFAULT_PROPS_MACRO}: argument must be provided - ${DEFAULT_PROPS_MACRO}()({ some: value })`
    );
  } else if (!t.isExpression(arg)) {
    return buildMacroError(
      path,
      `${DEFAULT_PROPS_MACRO}: argument must be "Expression", not "${arg.type}" - ${DEFAULT_PROPS_MACRO}()({ some: value })`
    );
  }

  path.parentPath.replaceWith(arg);

  return null;
});

module.exports = defaultPropsMacro;

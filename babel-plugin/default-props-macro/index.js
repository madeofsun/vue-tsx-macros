const babel = require("@babel/core");
const { DEFAULT_PROPS_MACRO } = require("../constants");
const createMacro = require("../define-macro");

const t = babel.types;

const defaultPropsMacro = createMacro(DEFAULT_PROPS_MACRO, (path) => {
  if (!path.parentPath.isCallExpression()) {
    return false;
  }

  const arg = path.parentPath.node.arguments[0];

  if (!t.isNode(arg)) {
    return false;
  }

  path.parentPath.replaceWith(arg);

  return true;
});

module.exports = defaultPropsMacro;

const babel = require("@babel/core");

const { COMPONENT_MACRO } = require("../constants");
const createMacro = require("../define-macro");
const findPathToReplace = require("./find-path-to-replace");
const parseComponent = require("./parse-component");
const parseDefaults = require("./parse-defaults");
const parseEmits = require("./parse-emits");
const parseProps = require("./parse-props");
const renderComponent = require("./render-component");
const parseVariableName = require("./parse-variable-name");

const componentMacro = createMacro(COMPONENT_MACRO, (path) => {
  const parsed = parse(path);
  if (!parsed) {
    return false;
  }

  const component = renderComponent(parsed.pathToReplace, parsed.options);
  if (!component) {
    return false;
  }

  parsed.pathToReplace.replaceWith(component);
  return true;
});

module.exports = componentMacro;

/**
 *
 * @param {babel.NodePath<babel.types.CallExpression>} path
 * @returns {null | {
 *  pathToReplace: babel.NodePath,
 *  options: Parameters<typeof renderComponent>[1]
 * }}
 */
function parse(path) {
  const pathToReplace = findPathToReplace(path);
  if (!pathToReplace) {
    return null;
  }
  return {
    pathToReplace,
    options: {
      props: parseProps(path),
      emits: parseEmits(path),
      defaultProps: parseDefaults(path),
      component: parseComponent(path),
      variableName: parseVariableName(path),
    },
  };
}

const { COMPONENT_MACRO } = require("../constants");
const defineMacro = require("../define-macro");
const parse = require("./parse");
const renderComponent = require("./render");

const componentMacro = defineMacro(COMPONENT_MACRO, (path) => {
  const parsed = parse(path);

  if (parsed instanceof Error) {
    return parsed;
  }

  const component = renderComponent(parsed.path, parsed.options);

  parsed.path.replaceWith(component);

  return null;
});

module.exports = componentMacro;

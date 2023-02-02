const { COMPONENT_MACRO, VUE_DEFINE_COMPONENT } = require("../constants");
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

  if (parsed.options.component.type === "define") {
    return {
      imports: [
        {
          source: "vue",
          specifiers: [
            { imported: VUE_DEFINE_COMPONENT, local: VUE_DEFINE_COMPONENT },
          ],
        },
      ],
    };
  }

  return null;
});

module.exports = componentMacro;

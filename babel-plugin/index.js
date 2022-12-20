const babel = require("@babel/core");

const componentMacro = require("./component-macro");
const { MACRO_IMPORT } = require("./constants");
const defaultPropsMacro = require("./default-props-macro");

const t = babel.types;

module.exports = function babelPluginFeMacros() {
  const macros = [componentMacro, defaultPropsMacro];
  const macroImport = MACRO_IMPORT;

  return {
    name: "babel-plugin-fe-macros",
    /**
     * @type {babel.Visitor}
     */
    visitor: {
      ImportDeclaration(path) {
        if (path.node.source.value === macroImport) {
          /** @type {Map<string, number>} */
          const macroCountMap = new Map();

          for (const specifier of path.node.specifiers) {
            if (!t.isImportSpecifier(specifier)) {
              continue;
            }

            const macro = macros.find(
              (macro) =>
                t.isIdentifier(specifier.imported) &&
                specifier.imported.name === macro.name
            );

            if (!macro) {
              continue;
            }

            const referencePaths = path.scope.getBinding(
              specifier.local.name
            )?.referencePaths;

            if (!referencePaths) {
              continue;
            }

            for (const path of referencePaths) {
              if (path.isIdentifier() && path.parentPath.isCallExpression()) {
                macro?.transform(path.parentPath) &&
                  macroCountMap.set(
                    macro.name,
                    1 + (macroCountMap.get(macro.name) || 0)
                  );
              }
            }
          }

          const specifiers = path.node.specifiers.filter((specifier) => {
            if (!t.isImportSpecifier(specifier)) {
              return true;
            }

            const initialCount =
              path.scope.getBinding(specifier.local.name)?.references || 0;

            const macroCount =
              (t.isIdentifier(specifier.imported) &&
                specifier.imported.name &&
                macroCountMap.get(specifier.imported.name)) ||
              0;

            return initialCount > macroCount;
          });

          if (specifiers.length > 0) {
            path.node.specifiers = specifiers;
          } else {
            path.remove();
          }
        }
      },
    },
  };
};

const resolveContext = require("./resolve-context");
const buildMacroError = require("./helpers/build-macro-error");
const { MACRO_IMPORT } = require("./constants");

const componentMacro = require("./component-macro");
const defaultPropsMacro = require("./default-props-macro");
const useRenderMacro = require("./use-render-macro");

/**
 *
 * @param {babel} babel
 * @param {unknown} options
 * @returns {{name: string, visitor: babel.Visitor}}
 */
module.exports = function babelPluginFeMacros(babel, options) {
  resolveContext.set(babel, options);

  const t = babel.types;

  const macros = [componentMacro, useRenderMacro, defaultPropsMacro];
  const macroImport = MACRO_IMPORT;

  return {
    name: "babel-plugin-fe-macros",
    visitor: {
      ImportDeclaration(path) {
        if (path.node.source.value === macroImport) {
          /**
           * amount of transformed references for each macro
           * @type {Map<string, number>}
           */
          const macroCountMap = new Map();

          for (const specifier of path.node.specifiers) {
            if (!t.isImportSpecifier(specifier)) {
              // macro must use named import
              continue;
            }

            const macro = macros.find(
              (macro) =>
                t.isIdentifier(specifier.imported) &&
                specifier.imported.name === macro.name
            );

            if (!macro) {
              // macro is not supported
              continue;
            }

            const referencePaths = path.scope.getBinding(
              specifier.local.name
            )?.referencePaths;

            if (!referencePaths) {
              // macro is imported, but not used
              continue;
            }

            for (const path of referencePaths) {
              if (!path.parentPath?.isCallExpression()) {
                throw buildMacroError(
                  path,
                  `Macro "${macro.name}" must be used as "CallExpression" - ${macro.name}()`
                );
              }

              const error = macro.transform(path.parentPath);

              if (error) {
                throw error;
              }

              const current = macroCountMap.get(macro.name) || 0;
              macroCountMap.set(macro.name, current + 1);
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

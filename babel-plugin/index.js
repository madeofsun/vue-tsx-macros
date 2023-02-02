const resolveContext = require("./resolve-context");
const buildMacroError = require("./helpers/build-macro-error");
const { MACRO_IMPORT } = require("./constants");

const componentMacro = require("./component-macro");
const defaultPropsMacro = require("./default-props-macro");
const useRenderMacro = require("./use-render-macro");
const filter = require("./utils/filter");

/**
 *
 * @param {babel} babel
 * @param {unknown} options
 * @returns {{name: string, visitor: babel.Visitor<{imports: Map<string, Map<string | null, { local: string, imported: string | null }>> }>}}
 */
module.exports = function babelPluginFeMacros(babel, options) {
  resolveContext.set(babel, options);

  const t = babel.types;

  const macros = [componentMacro, useRenderMacro, defaultPropsMacro];
  const macroImport = MACRO_IMPORT;

  return {
    name: "babel-plugin-fe-macros",
    visitor: {
      ImportDeclaration(path, { imports }) {
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

              const result = macro.transform(path.parentPath);

              if (result instanceof Error) {
                throw result;
              }
              if (result?.imports) {
                for (const { source, specifiers } of result.imports) {
                  let value = imports.get(source);
                  if (!value) {
                    value = new Map();
                  }
                  for (const specifier of specifiers) {
                    value.set(specifier.imported, specifier);
                  }
                  imports.set(source, value);
                }
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
      Program: {
        enter(_, state) {
          state.imports = new Map();
        },
        exit(path, { imports }) {
          const declarations = filter(
            t.isImportDeclaration,
            path.get("body").map(({ node }) => node)
          );
          for (const declaration of declarations) {
            const source = declaration.source.value;
            const extra = imports.get(source);
            if (extra) {
              for (const specifier of declaration.specifiers) {
                if (t.isImportDefaultSpecifier(specifier) && extra.has(null)) {
                  extra.delete(null);
                } else if (
                  t.isImportSpecifier(specifier) &&
                  t.isIdentifier(specifier.imported) &&
                  t.isIdentifier(specifier.local) &&
                  extra.has(specifier.imported.name)
                ) {
                  extra.delete(specifier.imported.name);
                }
              }
            }
          }
          for (const [source, specifiers] of imports.entries()) {
            if (specifiers.size > 0) {
              path.get("body")[0]?.insertBefore(
                t.importDeclaration(
                  [...specifiers.values()].map((s) => {
                    if (s.imported) {
                      return t.importSpecifier(
                        t.identifier(s.local),
                        t.identifier(s.imported)
                      );
                    }
                    return t.importDefaultSpecifier(t.identifier(s.local));
                  }),
                  t.stringLiteral(source)
                )
              );
            }
          }
        },
      },
    },
  };
};

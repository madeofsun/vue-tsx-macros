/**
 *
 * @param {string} name
 * @param {(path: babel.NodePath<babel.types.CallExpression>) =>
 * | null
 * | {imports?: { specifiers: { local: string, imported: string | null}[], source: string }[] }
 * | ReturnType<import('./helpers/build-macro-error')> } transform
 */
module.exports = function defineMacro(name, transform) {
  return {
    name,
    transform,
  };
};

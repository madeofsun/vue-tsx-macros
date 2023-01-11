/**
 *
 * @param {string} name
 * @param {(path: babel.NodePath<babel.types.CallExpression>) => null | ReturnType<import('./helpers/build-macro-error')> } transform
 */
module.exports = function defineMacro(name, transform) {
  return {
    name,
    transform,
  };
};

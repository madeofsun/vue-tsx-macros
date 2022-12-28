/**
 *
 * @param {string} name
 * @param {(path: import('@babel/core').NodePath<import('@babel/core').types.CallExpression>) => null | ReturnType<import('./helpers/build-macro-error')> } transform
 */
module.exports = function defineMacro(name, transform) {
  return {
    name,
    transform,
  };
};

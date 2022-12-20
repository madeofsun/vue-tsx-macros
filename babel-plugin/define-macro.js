/**
 *
 * @param {string} name
 * @param {(path: import('@babel/core').NodePath<import('@babel/core').types.CallExpression>) => boolean} transform
 */
module.exports = function defineMacro(name, transform) {
  return {
    name,
    transform,
  };
};

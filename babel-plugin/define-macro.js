/**
 *
 * @param {string} name
 * @param {(path: import('@babel/core').NodePath<import('@babel/core').types.CallExpression>) => boolean} transform
 * @param {import('@babel/core').Visitor=} visitor
 */
module.exports = function defineMacro(name, transform, visitor) {
  return {
    name,
    transform,
    visitor,
  };
};

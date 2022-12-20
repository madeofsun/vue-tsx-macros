/**
 * @template T,S
 * @param {(v: any, ...args: any[]) => v is S} validator
 * @param {T[]} list
 * @returns {S[]}
 */
module.exports = function filter(validator, list) {
  // @ts-ignore
  return list.filter((v) => validator(v));
};

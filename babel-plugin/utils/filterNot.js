/**
 * @template T,S
 * @param {(v: any, ...args: any[]) => v is S} validator
 * @param {T[]} list
 * @returns {Exclude<T, S>[]}
 */
module.exports = function filterNot(validator, list) {
  // @ts-ignore
  return list.filter((v) => !validator(v));
};

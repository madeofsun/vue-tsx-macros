const babel = require("@babel/core");
const plugin = require("../index.js");

/**
 * @param {string} code
 * @returns {string}
 */
module.exports = function transformWithPlugin(code) {
  const res = babel.transformSync(code, {
    plugins: [["@babel/plugin-syntax-typescript", { isTSX: true }], plugin],
  })?.code;
  if (!res) {
    throw Error("Could not transform");
  }
  return res;
};

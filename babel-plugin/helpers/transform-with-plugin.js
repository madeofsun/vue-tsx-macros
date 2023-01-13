const babel = require("@babel/core");
const plugin = require("../index.js");

/**
 * @param {string} code
 * @param {PluginOptions} options
 * @returns {string}
 */
module.exports = function transformWithPlugin(code, options) {
  const res = babel.transformSync(code, {
    plugins: [
      ["@babel/plugin-syntax-typescript", { isTSX: true }],
      [plugin, options],
    ],
  })?.code;
  if (!res) {
    throw Error("Could not transform");
  }
  return res;
};

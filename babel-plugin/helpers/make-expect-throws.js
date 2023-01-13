const transformWithPlugin = require("./transform-with-plugin");

/**
 * @param {string=} macro
 * @param {PluginOptions=} options
 */
module.exports = function makeExpectThrows(macro, options = {}) {
  const macroPrefix = macro ? ` ${macro.replace("$", "\\$")}:` : "";
  /**
   * @param {string} code
   * @param {string} keyword
   */
  return (code, keyword) =>
    expect(() => transformWithPlugin(code, options)).toThrow(
      new RegExp(`^unknown file:${macroPrefix}.*${keyword}.*`)
    );
};

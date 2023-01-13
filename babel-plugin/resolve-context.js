const context = {
  /**
   * @type {babel}
   */
  // @ts-ignore
  babel: null,
  /**
   * @type {Required<PluginOptions>}
   */
  // @ts-ignore
  options: null,
};

function resolveContext() {
  return context;
}

/**
 * @param {babel} babel
 * @param {unknown} options
 */
resolveContext.set = (babel, options) => {
  context.babel = babel;
  context.options = parseOptions(options);
};

module.exports = resolveContext;

/**
 * @type {Required<PluginOptions>}
 */
const defaultOptions = {
  allowEmits: true,
};

/**
 * @param {unknown} options
 * @returns {Required<PluginOptions>}
 */
function parseOptions(options) {
  if (typeof options !== "object" || options === null) {
    return defaultOptions;
  }
  return Object.assign({}, defaultOptions, options);
}

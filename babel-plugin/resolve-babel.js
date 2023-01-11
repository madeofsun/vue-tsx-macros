/**
 * @type {babel}
 */
// @ts-ignore
let $babel = null;

function resolveBabel() {
  return $babel;
}

/**
 * @param {babel} babel
 */
resolveBabel.set = (babel) => {
  $babel = babel;
};

module.exports = resolveBabel;

const babel = require("@babel/core");

const { COMPONENT_MACRO, DOCS_LINK_LIMITATIONS } = require("../constants");
const buildMacroError = require("../helpers/build-macro-error");

const t = babel.types;

/**
 * @param {babel.NodePath} path
 * @param {babel.types.TSTypeElement[]} typeElements
 * @returns {ReturnType<import('../helpers/build-macro-error')> | string[]}
 */
module.exports = function getMemberKeys(path, typeElements) {
  /** @type {string[]} */
  const acc = [];

  for (const element of typeElements) {
    if (
      (!t.isTSPropertySignature(element) && !t.isTSMethodSignature(element)) ||
      !t.isIdentifier(element.key)
    ) {
      return buildMacroError(
        path,
        `${COMPONENT_MACRO}: type must use only explicitly defined string keys - ${DOCS_LINK_LIMITATIONS}`
      );
    }
    acc.push(element.key.name);
  }

  return acc;
};

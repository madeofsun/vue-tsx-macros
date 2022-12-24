const babel = require("@babel/core");
const filter = require("./filter");

const t = babel.types;

/**
 * @param {Array<babel.types.TSTypeElement>} typeElements
 * @returns {string[]}
 */
module.exports = function collectTypeMemberKeys(typeElements) {
  /** @type {string[]} */
  const acc = [];

  filter(t.isTSMethodSignature, typeElements).forEach((m) => {
    if (t.isIdentifier(m.key)) {
      acc.push(m.key.name);
    }
  });

  filter(t.isTSPropertySignature, typeElements).forEach((m) => {
    if (t.isIdentifier(m.key)) {
      acc.push(m.key.name);
    }
  });

  return acc;
};

const babel = require("@babel/core");
const filter = require("../utils/filter");

const t = babel.types;

/**
 * @param {babel.NodePath<babel.types.CallExpression>} path
 * @returns {string[] | babel.types.Expression}
 */
module.exports = function parseProps(path) {
  const propsArg = path.node.arguments[0];
  if (t.isExpression(propsArg)) {
    return propsArg
  }

  const propsType = path.node.typeParameters?.params[0];

  if (!propsType) {
    return [];
  }

  if (t.isTSTypeLiteral(propsType)) {
    return parsePropsFromTypeElements(propsType.members);
  }

  if (t.isTSTypeReference(propsType) && t.isIdentifier(propsType.typeName)) {
    const id = propsType.typeName.name;

    const program = path.findParent((path) => path.isProgram());

    /** @type {string[] | undefined} */
    let acc = [];

    program?.traverse({
      TSTypeAliasDeclaration(path) {
        if (
          path.node.id.name === id &&
          t.isTSTypeLiteral(path.node.typeAnnotation)
        ) {
          acc = parsePropsFromTypeElements(path.node.typeAnnotation.members);
          path.stop();
        }
      },
      TSInterfaceDeclaration(path) {
        if (path.node.id.name === id) {
          acc = parsePropsFromTypeElements(path.node.body.body);
          path.stop();
        }
      },
    });

    if (acc) {
      return acc;
    }
  }

  return [];
};

/**
 * @param {Array<babel.types.TSTypeElement>} typeElements
 * @returns {string[]}
 */
function parsePropsFromTypeElements(typeElements) {
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
}

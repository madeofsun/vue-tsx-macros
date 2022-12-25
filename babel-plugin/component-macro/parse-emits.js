const babel = require("@babel/core");
const collectTypeMemberKeys = require("../utils/collect-type-member-keys");

const t = babel.types;

/**
 * @param {babel.NodePath<babel.types.CallExpression>} path
 * @returns {string[] | babel.types.Expression}
 */
module.exports = function parseEmits(path) {
  const emitsArg = path.node.arguments[1];
  if (t.isExpression(emitsArg)) {
    return emitsArg;
  }

  const emitsType = path.node.typeParameters?.params[1];

  if (!emitsType) {
    return [];
  }

  if (t.isTSTypeLiteral(emitsType)) {
    return collectTypeMemberKeys(emitsType.members);
  }

  if (t.isTSTypeReference(emitsType) && t.isIdentifier(emitsType.typeName)) {
    const id = emitsType.typeName.name;

    const program = path.findParent((path) => path.isProgram());

    /** @type {string[] | undefined} */
    let acc = undefined;

    program?.traverse({
      TSTypeAliasDeclaration(path) {
        if (
          path.node.id.name === id &&
          t.isTSTypeLiteral(path.node.typeAnnotation)
        ) {
          acc = collectTypeMemberKeys(path.node.typeAnnotation.members);
          path.stop();
        }
      },
      TSInterfaceDeclaration(path) {
        if (path.node.id.name === id) {
          acc = collectTypeMemberKeys(path.node.body.body);
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

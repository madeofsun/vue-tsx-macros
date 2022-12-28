const babel = require("@babel/core");

const buildMacroError = require("../helpers/build-macro-error");
const { DOCS_LINK_LIMITATIONS, COMPONENT_MACRO } = require("../constants");
const collectTypeMemberKeys = require("./get-member-keys");

const t = babel.types;

/**
 * @param {babel.NodePath<babel.types.CallExpression>} path
 * @returns {ReturnType<import('../helpers/build-macro-error')> | import('./render').RenderOptions['props']}
 */
module.exports = function parseProps(path) {
  const propsArg = path.node.arguments[0];
  if (t.isExpression(propsArg)) {
    return propsArg;
  } else if (propsArg !== undefined) {
    return buildMacroError(
      path,
      `${COMPONENT_MACRO}: props argument is not "Expression"`
    );
  }

  const propsType = path.node.typeParameters?.params[0];

  if (!propsType) {
    return null;
  }

  if (t.isTSTypeLiteral(propsType)) {
    return collectTypeMemberKeys(path, propsType.members);
  }

  if (!t.isTSTypeReference(propsType) || !t.isIdentifier(propsType.typeName)) {
    return buildMacroError(
      path,
      `${COMPONENT_MACRO}: props type parameter must be a "TypeLiteral" or a "TypeReference" - ${DOCS_LINK_LIMITATIONS}`
    );
  }

  const id = propsType.typeName.name;

  const program = path.findParent((path) => path.isProgram());

  /** @type {undefined | string[] | ReturnType<import('../helpers/build-macro-error')>} */
  let acc = undefined;

  program?.traverse({
    TSTypeAliasDeclaration(path) {
      if (path.node.id.name === id) {
        path.stop();

        if (!t.isTSTypeLiteral(path.node.typeAnnotation)) {
          acc = buildMacroError(
            path,
            `${COMPONENT_MACRO}: Right-side expression must be a "TypeLiteral" - ${DOCS_LINK_LIMITATIONS}`
          );
        } else {
          acc = collectTypeMemberKeys(path, path.node.typeAnnotation.members);
        }
      }
    },
    TSInterfaceDeclaration(path) {
      if (path.node.id.name === id) {
        path.stop();

        acc = collectTypeMemberKeys(path, path.node.body.body);
      }
    },
  });

  if (!acc) {
    return buildMacroError(
      path,
      `${COMPONENT_MACRO}: Type ${id} is not defined in the current file. Props type parameter must point to "InterfaceDeclaration" or "TypeAliasDeclaration" in the same file - ${DOCS_LINK_LIMITATIONS}`
    );
  }

  return acc;
};

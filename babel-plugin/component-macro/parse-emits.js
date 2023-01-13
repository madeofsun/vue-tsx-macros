const resolveContext = require("../resolve-context");

const buildMacroError = require("../helpers/build-macro-error");
const { COMPONENT_MACRO, DOCS_LINK_LIMITATIONS } = require("../constants");
const collectTypeMemberKeys = require("./get-member-keys");

/**
 * @param {babel.NodePath<babel.types.CallExpression>} macroCallPath
 * @returns {ReturnType<import('../helpers/build-macro-error')> | import('./render').RenderOptions['emits']}
 */
module.exports = function parseEmits(macroCallPath) {
  const {
    babel: { types: t },
    options: { allowEmits },
  } = resolveContext();

  if (
    !allowEmits &&
    (macroCallPath.node.arguments[1] !== undefined ||
      macroCallPath.node.typeParameters?.params[1] !== undefined)
  ) {
    return buildMacroError(
      macroCallPath,
      `${COMPONENT_MACRO}: emits are not allowed - "allowEmits" plugin option is set to "false"`
    );
  }

  const emitsArg = macroCallPath.node.arguments[1];
  if (t.isExpression(emitsArg)) {
    return emitsArg;
  } else if (emitsArg !== undefined) {
    return buildMacroError(
      macroCallPath,
      `${COMPONENT_MACRO}: emits argument is not "Expression"`
    );
  }

  const emitsType = macroCallPath.node.typeParameters?.params[1];

  if (!emitsType) {
    return null;
  }

  if (t.isTSTypeLiteral(emitsType)) {
    return collectTypeMemberKeys(macroCallPath, emitsType.members);
  }

  if (!t.isTSTypeReference(emitsType) || !t.isIdentifier(emitsType.typeName)) {
    return buildMacroError(
      macroCallPath,
      `${COMPONENT_MACRO}: emits type parameter must be a "TypeLiteral" or a "TypeReference"  - ${DOCS_LINK_LIMITATIONS}`
    );
  }

  const id = emitsType.typeName.name;

  const program = macroCallPath.findParent((path) => path.isProgram());

  /** @type {undefined | string[] | ReturnType<import('../helpers/build-macro-error')>} */
  let acc = undefined;

  program?.traverse({
    TSTypeAliasDeclaration(path) {
      if (path.node.id.name === id) {
        path.stop();

        if (!t.isTSTypeLiteral(path.node.typeAnnotation)) {
          acc = buildMacroError(
            path,
            `${COMPONENT_MACRO}: Right-side expression must be a "TypeLiteral", in order to be used in "${COMPONENT_MACRO}" as emits type parameter - ${DOCS_LINK_LIMITATIONS}`
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
      macroCallPath,
      `${COMPONENT_MACRO}: Type ${id} is not defined in the current file. Emits type parameter must point to "InterfaceDeclaration" or "TypeAliasDeclaration" in the same file - ${DOCS_LINK_LIMITATIONS}`
    );
  }

  return acc;
};

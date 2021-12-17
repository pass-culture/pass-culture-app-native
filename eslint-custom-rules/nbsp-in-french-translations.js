/**
 * This rule aims to spot misuses of a space instead of a non-breaking space (nbsp) with code \u00a0
 * before some characters in French translations, such as ! ? : ; € » or after «
 *
 * Ex: "Bienvenue !" should be "Bienvenue\u00a0!"
 */

module.exports = {
  name: 'nbsp-in-french-translations',
  meta: {
    docs: {
      description:
        'force the use of non-breaking space before some characters in French translations',
    },
    fixable: 'code',
  },
  create(context) {
    return {
      'TaggedTemplateExpression[tag.name="t"] > TemplateLiteral > TemplateElement[value.raw=/\\s+[!?]/]':
        (node) => {
          context.report({
            node,
            message: 'Please use \\u00a0 (nbsp) instead of whitespace before !, ?',
            fix: function (fixer) {
              const textToReplace = node.value.raw.replace(/\s+([!?])/g, '\\u00a0$1')
              return fixer.replaceText(node, `\`${textToReplace}\``)
            },
          })
        },
    }
  },
}

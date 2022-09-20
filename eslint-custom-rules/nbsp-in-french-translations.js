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
      // For t`textToTranslate !`
      'TaggedTemplateExpression[tag.name="t"] > TemplateLiteral > TemplateElement[value.raw=/\\s+[!?:»€]/]':
        (node) => {
          context.report({
            node,
            message: 'Please use \\u00a0 (nbsp) instead of whitespace before !, ?, :, », €',
            fix: function (fixer) {
              const textToReplace = node.value.raw.replace(/\s+([!?:»€])/g, '\\u00a0$1')
              const range = getReplaceRange(node)

              return fixer.replaceTextRange(range, textToReplace)
            },
          })
        },
      'TaggedTemplateExpression[tag.name="t"] > TemplateLiteral > TemplateElement[value.raw=/«\\s+/]':
        (node) => {
          context.report({
            node,
            message: 'Please use \\u00a0 (nbsp) instead of whitespace after «',
            fix: function (fixer) {
              const textToReplace = node.value.raw.replace(/(«)\s+/g, '$1\\u00a0')
              const range = getReplaceRange(node)

              return fixer.replaceTextRange(range, textToReplace)
            },
          })
        },
      'CallExpression[callee.name="t"] > ObjectExpression > Property[key.name="message"][value.raw=/«\\s+/]':
        (node) => {
          context.report({
            node,
            message: 'Please use \\u00a0 (nbsp) instead of whitespace after «',
            fix: function (fixer) {
              const textToReplace = 'message: ' + node.value.raw.replace(/(«)\s+/g, '$1\\u00a0')

              return fixer.replaceText(node, textToReplace)
            },
          })
        },
    }
  },
}

function getReplaceRange(node) {
  // We use range here, because fixer.replaceText(node, textToReplace)
  // removes the backticks, "${" or "}" around the text.
  // It's because of the "range" property of the provided TemplateElement
  // in "node" variable: the range is too wide. So we process it manually,
  // removing the first character
  const startRangeIndex = node.range[0] + 1
  const endRangeIndex = startRangeIndex + node.value.raw.length
  return [startRangeIndex, endRangeIndex]
}

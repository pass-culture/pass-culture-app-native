/**
 * This rule aims to spot misuses of a space instead of a non-breaking space with code \u00a0 or &nbsp
 * before some characters in French translations, such as ! ? : ; € » or after «
 *
 * Ex: "Bienvenue !" should be "Bienvenue\u00a0!"
 *
 * The work here is based on ESLint documentation: https://eslint.org/docs/latest/developer-guide/working-with-rules
 * and especially for the selectors: https://eslint.org/docs/latest/developer-guide/selectors
 * You can visualize the "node" structure with: https://astexplorer.net/
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
      // \u00a0 for 'textToTranslate !' with characters !, ?, :, » and €
      "Literal[raw=/^'.*\\s+[!?:»€].*'$/]": (node) => {
        if (node.value.raw.includes('!important')) return

        context.report({
          node,
          message:
            'Please use unicode non-breaking space \\u00a0 instead of whitespace before !, ?, :, », €',
          fix: function (fixer) {
            const textToReplace = node.raw.replace(/\s+([!?:»€])/g, '\\u00a0$1')
            return fixer.replaceText(node, textToReplace)
          },
        })
      },

      // &nbsp; for "textToTranslate !" with characters !, ?, :, » and €
      'Literal[raw=/^\\".*\\s+[!?:»€].*\\"$/]': (node) => {
        context.report({
          node,
          message:
            'Please use unicode non-breaking space &nbsp; instead of whitespace before !, ?, :, », €',
          fix: function (fixer) {
            const textToReplace = node.raw.replace(/\s+([!?:»€])/g, '&nbsp;$1')
            return fixer.replaceText(node, textToReplace)
          },
        })
      },

      // \u00a0 for '« textToTranslate'
      "Literal[raw=/^'.*«\\s+.*'$/]": (node) => {
        context.report({
          node,
          message: 'Please use unicode non-breaking space \\u00a0 instead of whitespace after «',
          fix: function (fixer) {
            const textToReplace = node.raw.replace(/(«)\s+/g, '$1\\u00a0')
            return fixer.replaceText(node, textToReplace)
          },
        })
      },

      // &nbsp; for "« textToTranslate"
      'Literal[raw=/^\\".*«\\s+.*\\"$/]': (node) => {
        context.report({
          node,
          message: 'Please use unicode non-breaking space &nbsp; instead of whitespace after «',
          fix: function (fixer) {
            const textToReplace = node.raw.replace(/(«)\s+/g, '$1&nbsp;')
            return fixer.replaceText(node, textToReplace)
          },
        })
      },

      // For `textToTranslate !` with characters !, ?, :, » and €
      'TemplateLiteral > TemplateElement[value.raw=/\\s+[!?:»€]/]': (node) => {
        if (node.value.raw.includes('!important')) return

        context.report({
          node,
          message:
            'Please use unicode non-breaking space \\u00a0 instead of whitespace before !, ?, :, », €',
          fix: function (fixer) {
            const textToReplace = node.value.raw.replace(/\s+([!?:»€])/g, '\\u00a0$1')
            const range = getReplaceRange(node)
            return fixer.replaceTextRange(range, textToReplace)
          },
        })
      },

      // For `« textToTranslate`
      'TemplateLiteral > TemplateElement[value.raw=/«\\s+/]': (node) => {
        context.report({
          node,
          message: 'Please use unicode non-breaking space \\u00a0 instead of whitespace after «',
          fix: function (fixer) {
            const textToReplace = node.value.raw.replace(/(«)\s+/g, '$1\\u00a0')
            const range = getReplaceRange(node)
            return fixer.replaceTextRange(range, textToReplace)
          },
        })
      },

      // For <Text>textToTranslate !</Text> with characters !, ?, :, » and €
      'JSXText[value=/\\s+[!?:»€]/]': (node) => {
        context.report({
          node,
          message:
            'Please use &nbsp; (non-breaking space) instead of whitespace before !, ?, :, », €',
          fix: function (fixer) {
            const textToReplace = node.value.replace(/\s+([!?:»€])/g, '&nbsp;$1')

            return fixer.replaceText(node, textToReplace)
          },
        })
      },

      // For <Text>« textToTranslate</Text>
      'JSXText[value=/«\\s+/]': (node) => {
        context.report({
          node,
          message: 'Please use &nbsp; (non-breaking space) instead of whitespace after «',
          fix: function (fixer) {
            const textToReplace = node.value.replace(/(«)\s+/g, '$1&nbsp;')

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

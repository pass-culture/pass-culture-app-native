/**
 * This rule aims to spot misuses of a space instead of a non-breaking space with code \u00a0 or &nbsp;
 * before some characters in French, such as ! ? : ; € » or after «
 *
 * Ex: "Bienvenue !" should be "Bienvenue&nbsp;!"
 *
 * The work here is based on ESLint documentation: https://eslint.org/docs/latest/developer-guide/working-with-rules
 * and especially for the selectors: https://eslint.org/docs/latest/developer-guide/selectors
 * You can visualize the "node" structure with: https://astexplorer.net/
 */

module.exports = {
  name: 'nbsp-in-text',
  meta: {
    docs: {
      description: 'force the use of non-breaking space before some characters in text',
    },
    messages: {
      u00u0Before:
        'Please use unicode non-breaking space \\u00a0 instead of whitespace before !, ?, :, », €',
      u00a0After: 'Please use unicode non-breaking space \\u00a0 instead of whitespace after «',
      nbspBefore:
        'Please use unicode non-breaking space &nbsp; instead of whitespace before !, ?, :, », €',
      nbspAfter: 'Please use unicode non-breaking space &nbsp; instead of whitespace after «',
    },
    fixable: 'code',
  },
  create(context) {
    return {
      // \u00a0 for 'myText !' with characters !, ?, :, » and €
      "Literal[raw=/^'.*\\s+[!?:»€].*'$/]": (node) => {
        if (node.raw.includes('!important')) return

        context.report({
          node,
          messageId: 'u00u0Before',
          fix: function (fixer) {
            const textToReplace = node.raw.replace(/\s+([!?:»€])/g, '\\u00a0$1')
            return fixer.replaceText(node, textToReplace)
          },
        })
      },

      // \u00a0 for '« myText'
      "Literal[raw=/^'.*«\\s+.*'$/]": (node) => {
        context.report({
          node,
          messageId: 'u00a0After',
          fix: function (fixer) {
            const textToReplace = node.raw.replace(/(«)\s+/g, '$1\\u00a0')
            return fixer.replaceText(node, textToReplace)
          },
        })
      },

      // \u00a0 for `myText !` with characters !, ?, :, » and €
      'TemplateLiteral > TemplateElement[value.raw=/\\s+[!?:»€]/]': (node) => {
        if (node.value.raw.includes('!important')) return

        context.report({
          node,
          messageId: 'u00u0Before',
          fix: function (fixer) {
            const textToReplace = node.value.raw.replace(/\s+([!?:»€])/g, '\\u00a0$1')
            const range = getReplaceRange(node)
            return fixer.replaceTextRange(range, textToReplace)
          },
        })
      },

      // \u00a0 for `« myText`
      'TemplateLiteral > TemplateElement[value.raw=/«\\s+/]': (node) => {
        context.report({
          node,
          messageId: 'u00a0After',
          fix: function (fixer) {
            const textToReplace = node.value.raw.replace(/(«)\s+/g, '$1\\u00a0')
            const range = getReplaceRange(node)
            return fixer.replaceTextRange(range, textToReplace)
          },
        })
      },

      // &nbsp; for "myText !" with characters !, ?, :, » and €
      'Literal[raw=/^\\".*\\s+[!?:»€].*\\"$/]': (node) => {
        if (node.raw.includes('!important')) return

        context.report({
          node,
          messageId: 'nbspBefore',
          fix: function (fixer) {
            const textToReplace = node.raw.replace(/\s+([!?:»€])/g, '&nbsp;$1')
            return fixer.replaceText(node, textToReplace)
          },
        })
      },

      // &nbsp; for "« myText"
      'Literal[raw=/^\\".*«\\s+.*\\"$/]': (node) => {
        context.report({
          node,
          messageId: 'nbspAfter',
          fix: function (fixer) {
            const textToReplace = node.raw.replace(/(«)\s+/g, '$1&nbsp;')
            return fixer.replaceText(node, textToReplace)
          },
        })
      },

      // &nbsp; for <Text>myText !</Text> with characters !, ?, :, » and €
      'JSXText[raw=/\\s+[!?:»€]/]': (node) => {
        context.report({
          node,
          messageId: 'nbspBefore',
          fix: function (fixer) {
            const textToReplace = node.value.replace(/\s+([!?:»€])/g, '&nbsp;$1')

            return fixer.replaceText(node, textToReplace)
          },
        })
      },

      // &nbsp; for <Text>« myText</Text>
      'JSXText[raw=/«\\s+/]': (node) => {
        context.report({
          node,
          messageId: 'nbspAfter',
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

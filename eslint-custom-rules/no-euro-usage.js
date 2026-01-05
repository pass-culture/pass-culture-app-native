module.exports = {
  name: 'no-euro-usage',
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow the use of the euro symbol (€) and the words "euro" or "euros"',
      recommended: false,
    },
    messages: {
      euroSymbol: 'Usage of the euro symbol (€) or the words "euro" or "euros" is not allowed.',
    },
  },
  create(context) {
    const EURO_REGEX = /€|\b(euros?)\b/i

    function checkForSymbols(node, value) {
      if (EURO_REGEX.test(value)) {
        context.report({ node, messageId: 'euroSymbol' })
      }
    }

    return {
      Literal(node) {
        if (typeof node.value === 'string') {
          checkForSymbols(node, node.value)
        }
      },
      JSXText(node) {
        checkForSymbols(node, node.value)
      },
      TemplateLiteral(node) {
        node.quasis.forEach((templateElement) => {
          checkForSymbols(templateElement, templateElement.value.cooked || '')
        })
      },
    }
  },
}

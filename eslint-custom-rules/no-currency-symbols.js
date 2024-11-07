module.exports = {
  name: 'no-currency-symbols',
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow the use of the euro symbol (€)',
      recommended: false,
    },
    messages: {
      euroSymbol: 'Usage of the euro symbol (€) is not allowed.',
    },
  },
  create(context) {
    function checkForSymbols(node, value) {
      if (value.includes('€')) {
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

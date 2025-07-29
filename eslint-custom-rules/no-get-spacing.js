module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbids the use of getSpacing and recommends using theme.designSystem.size.*',
      recommended: true,
    },
    messages: {
      noGetSpacing: 'Use theme.designSystem.size.* instead of getSpacing',
    },
  },

  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.type === 'Identifier' && node.callee.name === 'getSpacing') {
          context.report({
            node,
            messageId: 'noGetSpacing',
          })
        }
      },
    }
  },
}

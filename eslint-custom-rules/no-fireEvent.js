module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbids the use of fireEvent and recommends userEvent',
      recommended: true,
    },
    messages: {
      useUserEvent: 'Use userEvent instead of fireEvent for better user interaction simulation',
    },
  },

  create(context) {
    return {
      CallExpression(node) {
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.name === 'fireEvent' &&
          node.callee.property.name === 'press'
        ) {
          context.report({
            node,
            messageId: 'useUserEvent',
          })
        }
      },
    }
  },
}

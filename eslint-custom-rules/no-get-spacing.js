module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Forbids the use of getSpacing with values between 0 and 12 and recommends using theme.designSystem.size.*',
      recommended: true,
    },
    messages: {
      noGetSpacing: 'Use theme.designSystem.size.* instead of getSpacing',
    },
  },

  create(context) {
    return {
      CallExpression(node) {
        // Ensure this is a getSpacing(...) call
        if (node.callee.type !== 'Identifier' || node.callee.name !== 'getSpacing') return

        // Ensure there is at least one argument
        const arg = node.arguments[0]
        if (!arg) return

        // Ensure the argument is a numeric literal
        if (arg.type !== 'Literal' || typeof arg.value !== 'number') return

        // Ensure the value is between 0 (inclusive) and 13 (exclusive)
        if (arg.value >= 0 && arg.value < 13) {
          context.report({ node, messageId: 'noGetSpacing' })
        }
      },
    }
  },
}

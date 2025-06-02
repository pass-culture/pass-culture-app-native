module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbids the use of theme.colors.* and recommends theme.designSystem.color.*',
      recommended: true,
    },
    messages: {
      noThemeColors: 'Use theme.designSystem.color.* instead of theme.colors.*',
    },
  },

  create(context) {
    return {
      MemberExpression(node) {
        if (
          node.object &&
          node.object.type === 'Identifier' &&
          node.object.name === 'theme' &&
          node.property &&
          node.property.type === 'Identifier' &&
          node.property.name === 'colors'
        ) {
          context.report({
            node,
            messageId: 'noThemeColors',
          })
        }
      },
    }
  },
}

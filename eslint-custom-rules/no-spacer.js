
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbids the use of Spacer.Column, Spacer.Row and Spacer.Flex components',
      recommended: true,
    },
    messages: {
      noSpacerColumn: 'Do not use Spacer.Column component. Use `gap` (`ViewGap`), `margin` or `padding` instead.',
      noSpacerRow: 'Do not use Spacer.Row component. Use `margin` or `padding` instead.',
      noSpacerFlex: 'Do not use Spacer.Flex component. Add the `flex` property directly to your styles.'
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (
          node.name.type === 'JSXMemberExpression' &&
          node.name.object.name === 'Spacer' &&
          (['Column', 'Row', 'Flex'].includes(node.name.property.name))
        ) {
          context.report({
            node,
            messageId: `noSpacer${node.name.property.name}`,
          })
        }
      },
    }
  },
}

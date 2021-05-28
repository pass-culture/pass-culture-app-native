/* eslint-disable */

/**
 * This rule aims to prevent displaying empty string "" out of any <text>
 */

/* KO:
string && <Component> 
*/

/* OK:
string ? <Component> : null
*/

module.exports = {
  name: 'no-string-check-before-component',
  meta: {
    docs: {
      description: 'disallow check on a string before displaying a component',
      category: 'Prevent from bugs String should be wrap in a Text component',
      recommended: true,
      url: 'https://eslint.org/docs/rules/',
    },
  },
  create(context) {
    return {
      LogicalExpression: function LogicalExpression(node) {
        const rightPart = node.right
        const leftPart = node.left
        if (
          node.operator === '&&' &&
          rightPart.type === 'JSXElement' &&
          ((leftPart.type === 'UnaryExpression' && leftPart.operator !== '!') ||
            (leftPart.type !== 'UnaryExpression' && leftPart.type !== 'BinaryExpression'))
        ) {
          context.report({
            node,
            message:
              'Do not use string && component, use (string ? component : null) or ( !!string && component)',
          })
        }
      },
    }
  },
}

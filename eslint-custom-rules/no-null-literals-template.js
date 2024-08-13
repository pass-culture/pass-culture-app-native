/* eslint-disable */

/**
 * This rule aims to avoid using `${null}` in template literals
 */

/* KO:
`${null}`
*/

module.exports = {
  name: 'no-null-literals-template',
  meta: {
    docs: {
      description: 'Avoid using `${null}` in template literals',
      recommended: true,
      url: 'https://eslint.org/docs/rules/',
    },
    fixable: 'code',
  },
  create(context) {
    return {
      TemplateLiteral(node) {
        node.expressions.forEach((expression) => {
          if (
            (expression.type === 'Literal' && expression.value === null) || // Direct null
            (expression.type === 'ConditionalExpression' &&
              // condition ? consequent : alternate
              ((expression.consequent.type === 'Literal' && expression.consequent.value === null) ||
                (expression.alternate.type === 'Literal' && expression.alternate.value === null)))
          ) {
            context.report({
              node: expression,
              message: 'Avoid using `${null}` in template literals.',
            })
          }
        })
      },
    }
  },
}

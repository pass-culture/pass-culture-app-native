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
  name: 'use-ternary-operator-in-jsx',
  meta: {
    docs: {
      description: 'use ternary operator in JSX instead of && operator',
      recommended: true,
      url: 'https://eslint.org/docs/rules/',
    },
    fixable: 'code',
  },
  create(context) {
    return {
      LogicalExpression(node) {
        const rightPart = node.right
        if (node.operator === '&&' && rightPart.type === 'JSXElement') {
          context.report({
            node,
            message: 'Use ternary operator instead of && operator in JSX',
            fix(fixer) {
              const sourceCode = context.getSourceCode();
              const conditionText = sourceCode.getText(node.left);
              const jsxText = sourceCode.getText(node.right);

              const ternaryExpression = `${conditionText} ? ${jsxText} : null`;

              return fixer.replaceText(node, ternaryExpression);
            },
          })
        }
      },
    }
  },
}

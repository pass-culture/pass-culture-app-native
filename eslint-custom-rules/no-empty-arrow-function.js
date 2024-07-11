/* eslint-disable */

/**
 * This rule aims to prevent using jest.fn() rather than () => {}
 */

/* KO:
() => {}
*/

/* OK:
jest.fn()
*/

module.exports = {
  name: 'no-empty-arrow-function',
  meta: {
    docs: {
      description: 'use jest.fn() rather than () => {}',
      recommended: true,
      url: 'https://eslint.org/docs/rules/',
    },
    fixable: 'code',
  },
  create(context) {
    return {
      ArrowFunctionExpression(node) {
        if (node.body.type === 'BlockStatement' && node.body.body.length === 0) {
          const parent = node.parent
          let isInAct = false

          // Check if arrow function is used in an act()
          let current = node
          while (current) {
            if (
              current.type === 'CallExpression' &&
              current.callee.type === 'Identifier' &&
              current.callee.name === 'act'
            ) {
              isInAct = true
              break
            }
            current = current.parent
          }

          if (!isInAct) {
            context.report({
              node,
              message: 'Use jest.fn() rather than () => {}',
              fix(fixer) {
                return fixer.replaceText(node, 'jest.fn()')
              },
            })
          }
        }
      },
    }
  },
}

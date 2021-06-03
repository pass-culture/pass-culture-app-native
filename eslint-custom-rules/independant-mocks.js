/**
 * This rule aims to spot dependant tests.
 * Ex:  I mock a function in test A and the mock is not reset after. So test B uses test A's mock
 */

/* KO:
it('should do something', () => {
    myFunction.mockImplementation(() => {})
    // my test
  })
*/

/* OK:
myFunction.mockImplementation(() => {})
it('should do something', () => {
  // my test
})
*/

module.exports = {
  name: 'independant-mocks',
  meta: {
    docs: {
      description: 'disallow console use',
    },
  },
  create(context) {
    return {
      'CallExpression[callee.name="it"] > ArrowFunctionExpression > BlockStatement > ExpressionStatement > CallExpression > MemberExpression[property.name="mockImplementation"]': (
        node
      ) => {
        context.report({
          node,
          message: 'Use mockImplementation outside it() definition',
        })
      },
      'CallExpression[callee.name="it"] > ArrowFunctionExpression > BlockStatement > ExpressionStatement > CallExpression > MemberExpression[property.name="mockReturnValue"]': (
        node
      ) => {
        context.report({
          node,
          message: 'Use mockReturnValue outside it() definition',
        })
      },
      'CallExpression[callee.name="it"] > ArrowFunctionExpression > BlockStatement > ExpressionStatement > CallExpression > MemberExpression[property.name="mockResolvedValue"]': (
        node
      ) => {
        context.report({
          node,
          message: 'Use mockResolvedValue outside it() definition',
        })
      },
    }
  },
}

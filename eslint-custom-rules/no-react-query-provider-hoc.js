/**
 * This rule aims to spot error thrown on test.
 */

/* KO:
reactQueryProviderHOC(<Component />))
*/

/* OK : 
jest.mock('@tanstack/react-query')
*/

module.exports = {
  name: 'no-react-query-provider-hoc',
  meta: {
    docs: {
      description: 'disallow reactQueryProviderHOC',
    },
  },
  create(context) {
    return {
      CallExpression: function CallExpression(node) {
        const methodName = node.callee && node.callee.name
        if (methodName === 'reactQueryProviderHOC') {
          context.report({
            node,
            message:
              'Do not use reactQueryProviderHOC in tests, mock react-query instead. See -> https://www.notion.so/passcultureapp/Journ-e-flacky-tests-39da0786dec94af2b39f75562dfc43bf#eb048a3559dc4025867a22dc5d865ed6',
          })
        }
      },
    }
  },
}

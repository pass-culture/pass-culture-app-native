/**
 * This rule aims to spot error thrown on test.
 * Ex: flaky test were not all catch because of allowConsole use
 */

/* KO:
allowConsole({ error: true })
*/

/* OK:
use while debugging a test on dev environment
*/

module.exports = {
  name: 'no-allow-console',
  meta: {
    docs: {
      description: 'disallow console use',
    },
  },
  create(context) {
    return {
      CallExpression: function CallExpression(node) {
        const methodName = node.callee && node.callee.name
        if (methodName === 'allowConsole') {
          context.report({
            node,
            message: 'Do not use allowConsole on CI tests',
          })
        }
      },
    }
  },
}

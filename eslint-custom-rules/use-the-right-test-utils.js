/**
 * This rule helps the use of the right tests utils in the native or web tests.
 *
 * KO:
 * // in a .web.test:
 * import { … } from 'tests/utils'      -> use 'tests/utils/web'
 *
 * KO:
 * // in a .native.test:
 * import { … } from 'tests/utils/web'  -> use 'tests/utils
 */

const path = require('path')

module.exports = {
  name: 'use-the-right-test-utils',
  meta: {
    docs: {
      description: 'force the use of the right tests utils in the native or web tests.',
    },
    messages: {
      useWebTestUtils: "Please use 'tests/utils/web' in web tests, instead of 'tests/utils'",
    },
    fixable: 'code',
  },
  create(context) {
    const filename = context.getFilename()
    const absoluteFilename = path.resolve(filename)
    const basename = path.basename(absoluteFilename)

    return {
      'ImportDeclaration[source.value="tests/utils"]': (node) => {
        // run only in .web.test files
        if (!/.*\.web\.test\..*/.test(basename)) return

        context.report({
          node,
          messageId: 'useWebTestUtils',
          fix: function (fixer) {
            return fixer.replaceTextRange(node.source.range, "'tests/utils/web'")
          },
        })
      },
    }
  },
}

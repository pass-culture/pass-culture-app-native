/**
 * This rule aims to spot when we use expect(queryAll(...)).toBeTruthy() in our tests
 * [] is truthy so this condition is always verified and can cause false positive tests
 * We should use .not.toHaveLength(0)
 *
 * KO:
 * expect(screen.queryAllByText('Hello world')).toBeTruthy()
 *
 * OK:
 * expect(screen.queryAllByText('Hello world')).toHaveLength(0)
 * expect(screen.queryByText('Hello world')).toBeTruthy()
 */

function matchesPattern(identifier) {
  return /^(queryAllBy)[A-Za-z].+/.test(identifier)
}

function findNestedNode(node, matchesNodeCriteria) {
  if (matchesNodeCriteria(node)) {
    return node
  }

  for (const key in node) {
    if (key !== 'parent' && node.hasOwnProperty(key)) {
      // Ignore the parent property
      const child = node[key]
      if (child && typeof child === 'object') {
        const result = findNestedNode(child, matchesNodeCriteria)
        if (result) {
          return result
        }
      }
    }
  }

  return null
}

module.exports = {
  name: 'no-truthy-check-after-queryAll-matchers',
  meta: {
    docs: {
      description:
        'avoid expect(queryAll(...)).toBeTruthy() in tests, because it will be always true (false positive).',
    },
    fixable: 'code',
  },
  create(context) {
    return {
      "CallExpression[callee.property.name='toBeTruthy'][callee.object.callee.name='expect']": (
        node
      ) => {
        if (
          findNestedNode(
            node,
            (node) =>
              node.type === 'CallExpression' &&
              matchesPattern(node.callee.name ?? node.callee.property.name)
          )
        ) {
          context.report({
            node,
            message: 'avoid toBeTruthy matchers with queryAll',
            fix(fixer) {
              // get the source code for the node, to replace easily
              const nodeSrc = context.getSourceCode().getText(node)

              const fixedSrc = nodeSrc.replace('toBeTruthy()', 'not.toHaveLength(0)')

              return fixer.replaceText(node, fixedSrc)
            },
          })
        }
      },
    }
  },
}

module.exports = {
  name: 'toSorted-instead-of-sort',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'A rule to use .toSorted instead of .sort',
    },
    fixable: 'code',
    hasSuggestions: true,
  },
  create(context) {
    return {
      "MemberExpression[property.name='sort']": (node) => {
        context.report({
          node,
          message:
            'Avoid .sort(), prefer .toSorted() that creates a copy instead of altering the array. See documentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted).',
          suggest: [
            {
              desc: 'use .toSorted()',
              fix(fixer) {
                const nodeSrc = context.getSourceCode().getText(node)

                const fixedSrc = nodeSrc.replace(/sort$/, 'toSorted')

                return fixer.replaceText(node, fixedSrc)
              },
            },
          ],
        })
      },
    }
  },
}

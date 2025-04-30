module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Forbids the use of @ts-expect-error and recommends fixing the issue or documenting it properly',
      recommended: true,
    },
    messages: {
      doNotUseTsExpectError:
        'Do not use `@ts-expect-error`. Prefer to fix the problem or document properly with a specific eslint-disable.',
    },
    schema: [],
  },

  create(context) {
    return {
      Program() {
        const sourceCode = context.getSourceCode()
        const comments = sourceCode.getAllComments()

        for (const comment of comments) {
          if (comment.type === 'Line' && comment.value.trim().startsWith('@ts-expect-error')) {
            context.report({
              loc: comment.loc,
              messageId: 'doNotUseTsExpectError',
            })
          }
        }
      },
    }
  },
}

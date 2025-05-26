module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Forbids the use of @ts-expect-error: because of noUncheckedIndexedAccess and recommends fixing the issue',
      recommended: true,
    },
    messages: {
      doNotUseTsExpectError:
        'Do not use `@ts-expect-error: because of noUncheckedIndexedAccess`. Prefer to fix the problem.',
    },
    schema: [],
  },

  create(context) {
    return {
      Program() {
        const sourceCode = context.getSourceCode()
        const comments = sourceCode.getAllComments()

        for (const comment of comments) {
          if (
            comment.type === 'Line' &&
            comment.value.trim().startsWith('@ts-expect-error: because of noUncheckedIndexedAccess')
          ) {
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

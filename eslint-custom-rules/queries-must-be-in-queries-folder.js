module.exports = {
  name: 'queries-must-be-in-queries-folder',
  meta: {
    type: 'problem',
    docs: {
      description: 'Files ending with Query or Mutation must be in a queries folder',
      recommended: false,
    },
    messages: {
      mustBeInQueriesFolder: 'Files ending with Query or Mutation must be in a queries folder',
    },
    schema: [],
  },
  defaultOptions: [],

  create(context) {
    const filename = context.getFilename()
    const isQueryOrMutationFile = /(Query|Mutation)\.(js|jsx|ts|tsx)$/.test(filename)

    if (isQueryOrMutationFile) {
      const normalizedPath = filename.replace(/\\/g, '/')
      const hasQueriesFolder = normalizedPath.includes('/queries/')

      if (!hasQueriesFolder) {
        context.report({
          node: context.getSourceCode().ast,
          loc: { line: 1, column: 1 },
          messageId: 'mustBeInQueriesFolder',
        })
      }
    }

    return {}
  },
}

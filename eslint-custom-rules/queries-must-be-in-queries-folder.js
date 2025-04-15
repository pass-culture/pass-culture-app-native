const path = require('path')

const QUERY_OR_MUTATION_FILE_PATTERN = /(use.*(Query|Mutation)|(Query|Mutation))\.(ts|tsx|js)$/

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
    const isQueryOrMutationFile = QUERY_OR_MUTATION_FILE_PATTERN.test(filename)

    if (isQueryOrMutationFile) {
      const normalizedPath = path.normalize(filename)
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

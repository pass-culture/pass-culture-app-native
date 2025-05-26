const path = require('path')

const QUERY_FILE_PATTERN = 'Query.ts'
const MUTATION_FILE_PATTERN = 'Mutation.ts'

function checkForUseQuery(node, context) {
  const callee = node.callee
  if (callee.type === 'Identifier' && callee.name === 'useQuery') {
    context.report({
      node: callee,
      loc: callee.loc,
      messageId: 'forbiddenUseQuery',
    })
  }
}

function checkForUseMutation(node, context) {
  const callee = node.callee
  if (callee.type === 'Identifier' && callee.name === 'useMutation') {
    context.report({
      node: callee,
      loc: callee.loc,
      messageId: 'forbiddenUseMutation',
    })
  }
}

module.exports = {
  name: 'no-queries-outside-query-files',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Forbids the use of useQuery and useMutation outside of files ending with *Query.ts or *Mutation.ts',
      recommended: false,
    },
    messages: {
      forbiddenUseQuery: 'useQuery can only be used in files ending with *Query.ts',
      forbiddenUseMutation: 'useMutation can only be used in files ending with *Mutation.ts',
    },
  },

  create(context) {
    const filename = context.getFilename()
    const isQueryFile = filename.endsWith(QUERY_FILE_PATTERN)
    const isMutationFile = filename.endsWith(MUTATION_FILE_PATTERN)
    const fileNameWithoutExtension = path.parse(filename).name

    return {
      CallExpression(node) {
        if (!isQueryFile) {
          checkForUseQuery(node, context)
        }
        if (!isMutationFile) {
          checkForUseMutation(node, context)
        }
      },
    }
  },
}

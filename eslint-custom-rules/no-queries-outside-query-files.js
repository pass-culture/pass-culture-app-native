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
    schema: [],
  },
  defaultOptions: [],

  create(context) {
    const filename = context.getFilename()
    const fileNameWithoutExtension =
      filename
        .split('/')
        .pop()
        ?.replace(/\.[^.]+$/, '') || ''
    const isQueryFile = fileNameWithoutExtension.endsWith('Query')
    const isMutationFile = fileNameWithoutExtension.endsWith('Mutation')

    function checkForUseQuery(node) {
      if (!isQueryFile) {
        const callee = node.callee
        if (callee.type === 'Identifier' && callee.name === 'useQuery') {
          context.report({
            node: callee,
            loc: callee.loc,
            messageId: 'forbiddenUseQuery',
          })
        }
      }
    }

    function checkForUseMutation(node) {
      if (!isMutationFile) {
        const callee = node.callee
        if (callee.type === 'Identifier' && callee.name === 'useMutation') {
          context.report({
            node: callee,
            loc: callee.loc,
            messageId: 'forbiddenUseMutation',
          })
        }
      }
    }

    return {
      CallExpression(node) {
        checkForUseQuery(node)
        checkForUseMutation(node)
      },
    }
  },
}

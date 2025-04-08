module.exports = {
  name: 'queries-only-in-use-query-functions',
  meta: {
    type: 'problem',
    docs: {
      description:
        'useQuery and useMutation can only be used in functions starting with use and ending with Query or Mutation respectively',
      recommended: false,
    },
    messages: {
      forbiddenUseQuery:
        'useQuery can only be used in functions starting with use and ending with Query',
      forbiddenUseMutation:
        'useMutation can only be used in functions starting with use and ending with Mutation',
    },
    schema: [],
  },
  defaultOptions: [],

  create(context) {
    function isInValidFunction(node, expectedSuffix) {
      let current = node
      while (current) {
        if (
          current.type === 'FunctionDeclaration' ||
          current.type === 'ArrowFunctionExpression' ||
          current.type === 'FunctionExpression'
        ) {
          if (current.type === 'FunctionDeclaration') {
            const functionName = current.id?.name
            return functionName
              ? /^use.*$/.test(functionName) && functionName.endsWith(expectedSuffix)
              : false
          }
          const parent = current.parent
          if (parent.type === 'VariableDeclarator' && parent.id.type === 'Identifier') {
            const functionName = parent.id.name
            return /^use.*$/.test(functionName) && functionName.endsWith(expectedSuffix)
          }
          return false
        }
        current = current.parent
      }
      return false
    }

    function checkForUseQuery(node) {
      const callee = node.callee
      if (callee.type === 'Identifier') {
        if (callee.name === 'useQuery' && !isInValidFunction(node, 'Query')) {
          context.report({
            node: callee,
            loc: callee.loc,
            messageId: 'forbiddenUseQuery',
          })
        }
        if (callee.name === 'useMutation' && !isInValidFunction(node, 'Mutation')) {
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
      },
    }
  },
}

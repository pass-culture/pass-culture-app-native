function isInValidFunction(node, expectedSuffix) {
  if (!node) return false

  if (node.type === 'FunctionDeclaration') {
    const functionName = node.id?.name
    return functionName
      ? functionName.startsWith('use') && functionName.endsWith(expectedSuffix)
      : false
  }

  if (node.type === 'ArrowFunctionExpression' || node.type === 'FunctionExpression') {
    const parent = node.parent
    if (parent.type === 'VariableDeclarator' && parent.id.type === 'Identifier') {
      const functionName = parent.id.name
      return functionName.startsWith('use') && functionName.endsWith(expectedSuffix)
    }
    return false
  }

  return isInValidFunction(node.parent, expectedSuffix)
}

function checkForUseQuery(node, context) {
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
    return {
      CallExpression(node) {
        checkForUseQuery(node, context)
      },
    }
  },
}

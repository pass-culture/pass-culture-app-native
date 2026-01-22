const MESSAGES = {
  mustReturnUseQuery:
    'Le hook "{{ name }}" se termine par "Query" et doit retourner le résultat d\'un appel à useQuery ou usePersistQuery.',
}

const EXCLUDED_HOOKS = new Set(['usePersistQuery'])

const isQueryHook = (name) => {
  if (!name || typeof name !== 'string') return false
  if (EXCLUDED_HOOKS.has(name)) return false

  const startsWithUse = name.startsWith('use')
  const endsWithQuery = name.endsWith('Query')
  const hasEnoughCharacters = name.length > 8

  return startsWithUse && endsWithQuery && hasEnoughCharacters
}

const isUseQueryCall = (node) => {
  if (!node) return false
  
  if (node.type === 'CallExpression') {
    const calleeName = node.callee?.name
    return (
      calleeName === 'useQuery' ||
      calleeName === 'usePersistQuery' ||
      isQueryHook(calleeName)
    )
  }
  
  return false
}

const returnsUseQuery = (functionBody) => {
  if (!functionBody) return false

  if (functionBody.type === 'CallExpression') {
    return isUseQueryCall(functionBody)
  }

  if (functionBody.type === 'BlockStatement') {
    const queryVariables = new Map()
    let hasUseQueryCall = false
    
    functionBody.body.forEach((statement) => {
      if (statement.type === 'VariableDeclaration') {
        statement.declarations.forEach((declaration) => {
          if (declaration.init && isUseQueryCall(declaration.init)) {
            if (declaration.id.type === 'Identifier') {
              queryVariables.set(declaration.id.name, true)
            }
            hasUseQueryCall = true
          }
        })
      }
      if (statement.type === 'ExpressionStatement' && isUseQueryCall(statement.expression)) {
        hasUseQueryCall = true
      }
    })
    
    const isQueryVariable = (node) => {
      if (!node) return false
      if (node.type === 'Identifier' && queryVariables.has(node.name)) {
        return true
      }
      return false
    }

    const isTernaryWithQueryVariables = (node) => {
      if (!node || node.type !== 'ConditionalExpression') return false
      return isQueryVariable(node.consequent) && isQueryVariable(node.alternate)
    }

    const hasAnyReturnWithValue = functionBody.body.some(
      (statement) => statement.type === 'ReturnStatement' && statement.argument
    )

    if (!hasAnyReturnWithValue && !hasUseQueryCall) {
      return true
    }

    if (!hasAnyReturnWithValue && hasUseQueryCall) {
      return false
    }

    const hasValidReturn = functionBody.body.some((statement) => {
      if (statement.type === 'ReturnStatement' && statement.argument) {
        if (isUseQueryCall(statement.argument)) {
          return true
        }
        
        if (isQueryVariable(statement.argument)) {
          return true
        }

        if (isTernaryWithQueryVariables(statement.argument)) {
          return true
        }
      }
      return false
    })
    
    return hasValidReturn
  }

  return false
}

module.exports = {
  name: 'query-hooks-must-return-use-query-result',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Les hooks se terminant par "Query" doivent avoir un type de retour explicite UseQueryResult',
      recommended: true,
    },
    messages: MESSAGES,
    schema: [],
  },
  defaultOptions: [],

  create(context) {
    let hasReactQueryImport = false

    const checkFunction = (node, functionName) => {
      if (!isQueryHook(functionName)) return
      if (!hasReactQueryImport) return

      const functionBody = node.body
      
      if (!returnsUseQuery(functionBody)) {
        context.report({
          node,
          messageId: 'mustReturnUseQuery',
          data: { name: functionName },
        })
      }
    }

    return {
      ImportDeclaration(node) {
        if (node.source.value === '@tanstack/react-query') {
          hasReactQueryImport = true
        }
      },
      FunctionDeclaration(node) {
        if (node.id && node.id.name) {
          checkFunction(node, node.id.name)
        }
      },
      VariableDeclarator(node) {
        if (
          node.init &&
          (node.init.type === 'ArrowFunctionExpression' || node.init.type === 'FunctionExpression') &&
          node.id.name
        ) {
          checkFunction(node.init, node.id.name)
        }
      },
    }
  },
}


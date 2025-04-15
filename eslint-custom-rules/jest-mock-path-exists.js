const fs = require('fs')
const path = require('path')

const pathExistsCache = new Map()

function pathExists(filePath) {
  if (pathExistsCache.has(filePath)) {
    return pathExistsCache.get(filePath)
  }

  try {
    fs.statSync(filePath)
    pathExistsCache.set(filePath, true)
    return true
  } catch (error) {
    pathExistsCache.set(filePath, false)
    return false
  }
}

function pathExistsWithExtensions(basePath, extensions) {
  return extensions.some((ext) => pathExists(basePath + ext))
}

function validateMockPath(mockPath, context, extensions) {
  if (extensions.some((ext) => mockPath.endsWith(ext))) {
    return {
      node: context.node,
      message: `The path "${mockPath}" in jest.mock() should not include a file extension`,
    }
  }

  const projectRoot = path.resolve(process.cwd())
  const srcPath = path.join(projectRoot, 'src')
  const nodeModulesPath = path.join(projectRoot, 'node_modules')

  let resolvedPath = mockPath

  if (mockPath.startsWith('./') || mockPath.startsWith('../')) {
    const currentFileDir = path.dirname(context.getFilename())
    resolvedPath = path.resolve(currentFileDir, mockPath)
  } else {
    const nodeModulesResolvedPath = path.join(nodeModulesPath, mockPath)

    if (
      pathExists(nodeModulesResolvedPath) ||
      pathExistsWithExtensions(nodeModulesResolvedPath, extensions)
    ) {
      return null
    }

    resolvedPath = path.join(srcPath, mockPath)
  }

  if (pathExists(resolvedPath) || pathExistsWithExtensions(resolvedPath, extensions)) {
    return null
  }

  return {
    node: context.node,
    message: `The path "${mockPath}" in jest.mock() is not found`,
  }
}

module.exports = {
  name: 'jest-mock-path-exists',
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure that the path in jest.mock() exists',
      category: 'Possible Errors',
      recommended: true,
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    const sourceCode = context.getSourceCode().getText()
    if (!sourceCode.includes('jest.mock(')) {
      return {}
    }

    const extensions = ['.ts', '.tsx', '.js', '.jsx', '.d.ts']

    return {
      CallExpression(node) {
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.name === 'jest' &&
          node.callee.property.name === 'mock' &&
          node.arguments.length > 0 &&
          node.arguments[0].type === 'Literal'
        ) {
          const mockPath = node.arguments[0].value

          const validationContext = {
            ...context,
            node: node.arguments[0],
          }

          const error = validateMockPath(mockPath, validationContext, extensions)
          if (error) {
            context.report(error)
          }
        }
      },
    }
  },
}

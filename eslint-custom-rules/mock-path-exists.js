const fs = require('fs')
const path = require('path')

const pathExistsCache = new Map()

function pathExists(filePath) {
  if (pathExistsCache.has(filePath)) {
    return pathExistsCache.get(filePath)
  }

  const exists = fs.existsSync(filePath)
  pathExistsCache.set(filePath, exists)
  return exists
}

function pathExistsWithExtensions(basePath, extensions) {
  return extensions.some((ext) => pathExists(basePath + ext))
}

function validateMockPath(mockPath, context, node, extensions) {
  if (extensions.some((ext) => mockPath.endsWith(ext))) {
    return {
      node,
      message: `The path "${mockPath}" in jest.mock() should not include a file extension`,
    }
  }

  const projectRoot = path.resolve(process.cwd())
  const srcPath = path.join(projectRoot, 'src')
  const nodeModulesPath = path.join(projectRoot, 'node_modules')

  let resolvedPath = mockPath

  const getFilename = () => {
    if (typeof context.getFilename === 'function') {
      return context.getFilename()
    }
    if (context.filename) {
      return context.filename
    }
    return 'unknown-file.js'
  }

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
    node,
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

    // Clear cache before each execution to ensure fresh results
    pathExistsCache.clear()

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

          const error = validateMockPath(mockPath, context, node.arguments[0], extensions)
          if (error) {
            context.report(error)
          }
        }
      },
    }
  },
}

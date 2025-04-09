const fs = require('fs')
const path = require('path')

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
          const projectRoot = path.resolve(process.cwd())
          const srcPath = path.join(projectRoot, 'src')
          const nodeModulesPath = path.join(projectRoot, 'node_modules')
          const extensions = ['.ts', '.tsx', '.js', '.jsx', '.d.ts']

          if (extensions.some((ext) => mockPath.endsWith(ext))) {
            context.report({
              node: node.arguments[0],
              message: `The path "${mockPath}" in jest.mock() should not include a file extension`,
            })
            return
          }

          let resolvedPath = mockPath
          if (mockPath.startsWith('./') || mockPath.startsWith('../')) {
            const currentFileDir = path.dirname(context.getFilename())
            resolvedPath = path.resolve(currentFileDir, mockPath)
          } else {
            const nodeModulesResolvedPath = path.join(nodeModulesPath, mockPath)
            const nodeModulesExists = extensions.some((ext) =>
              fs.existsSync(nodeModulesResolvedPath + ext)
            )
            if (nodeModulesExists || fs.existsSync(nodeModulesResolvedPath)) {
              return
            }

            resolvedPath = path.join(srcPath, mockPath)
          }

          const fileExists = extensions.some((ext) => fs.existsSync(resolvedPath + ext))
          if (!fileExists && !fs.existsSync(resolvedPath)) {
            context.report({
              node: node.arguments[0],
              message: `The path "${mockPath}" in jest.mock() is not found`,
            })
          }
        }
      },
    }
  },
}

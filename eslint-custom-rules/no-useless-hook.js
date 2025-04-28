module.exports = {
  name: 'no-useless-hook',
  meta: {
    docs: {
      description: "Prevent creating hooks that don't use other hooks",
      recommended: true,
    },
    messages: {
      noUselessHook:
        '"{{ name }}" is named like a hook but doesn\'t use any hooks. Rename it without the "use" prefix.',
    },
  },
  create(context) {
    // Ignore test files
    const filename = context.getFilename()
    if (
      filename.includes('/__tests__/') ||
      filename.includes('/__mocks__/') ||
      filename.endsWith('.test.ts') ||
      filename.endsWith('.test.tsx')
    ) {
      return {}
    }

    const fs = require('fs')
    const path = require('path')
    const dir = path.dirname(filename)
    const baseName = path.basename(filename, path.extname(filename))
    const isWebFile = filename.includes('.web.')

    const getCorrespondingFile = (baseName) => {
      const extensions = ['.ts', '.tsx']
      if (isWebFile) {
        return extensions.map((ext) => path.join(dir, `${baseName}${ext}`))
      } else {
        return extensions.map((ext) => path.join(dir, `${baseName}.web${ext}`))
      }
    }

    const correspondingFiles = getCorrespondingFile(baseName)

    const hasCorrespondingFileWithHooks = correspondingFiles.some((file) => {
      if (!fs.existsSync(file)) return false

      try {
        const content = fs.readFileSync(file, 'utf8')
        return content.includes('use') && content.includes('(')
      } catch (e) {
        return false
      }
    })

    if (hasCorrespondingFileWithHooks) {
      return {}
    }

    const isHookName = (name) =>
      name.startsWith('use') && name[3] && name[3].toUpperCase() === name[3]

    const hasHook = (node) => {
      const visited = new WeakSet()

      const checkNode = (node) => {
        if (!node || visited.has(node)) return false
        visited.add(node)

        if (
          node.type === 'CallExpression' &&
          node.callee.name &&
          node.callee.name.startsWith('use')
        ) {
          return true
        }

        for (const key in node) {
          if (node[key] && typeof node[key] === 'object') {
            if (checkNode(node[key])) return true
          }
        }

        return false
      }

      return checkNode(node)
    }

    return {
      FunctionDeclaration(node) {
        if (node.id && isHookName(node.id.name) && !hasHook(node)) {
          context.report({
            node,
            messageId: 'noUselessHook',
            data: {
              name: node.id.name,
            },
          })
        }
      },
      ArrowFunctionExpression(node) {
        if (
          node.parent.type === 'VariableDeclarator' &&
          node.parent.id.name &&
          isHookName(node.parent.id.name) &&
          !hasHook(node.body)
        ) {
          context.report({
            node,
            messageId: 'noUselessHook',
            data: {
              name: node.parent.id.name,
            },
          })
        }
      },
    }
  },
}

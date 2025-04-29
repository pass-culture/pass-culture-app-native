const fs = require('fs')
const path = require('path')

const MESSAGES = {
  noUselessHook:
    '"{{ name }}" is named like a hook but doesn\'t use any hooks. Rename it without the "use" prefix.',
}

const CONFIG = {
  testFilePatterns: ['/__tests__/', '/__mocks__/', '.test.ts', '.test.tsx'],
  fileExtensions: ['.ts', '.tsx'],
}

const isHookName = (name) => {
  if (!name || typeof name !== 'string') return false

  const startsWithUse = name.startsWith('use')
  const hasEnoughCharacters = name.length >= 4
  const hasUppercaseAfterUse = name[3] && name[3].toUpperCase() === name[3]

  return startsWithUse && hasEnoughCharacters && hasUppercaseAfterUse
}

const hasHookCall = (context) => {
  const sourceCode = context.getSourceCode()
  return sourceCode.ast.body.some((node) =>
    sourceCode
      .getTokens(node)
      .some(
        (token) =>
          sourceCode.getNodeByRangeIndex(token.range[0])?.type === 'CallExpression' &&
          isHookName(sourceCode.getNodeByRangeIndex(token.range[0])?.callee?.name)
      )
  )
}

const isTestFile = (context) => {
  const filename = context.getFilename()

  return CONFIG.testFilePatterns.some((pattern) => filename.includes(pattern))
}

const getCorrespondingFiles = (filename) => {
  const dir = path.dirname(filename)
  const baseName = path.basename(filename, path.extname(filename))
  const isWebFile = filename.includes('.web.')

  return CONFIG.fileExtensions.map((ext) =>
    path.join(dir, isWebFile ? baseName.replace('.web', '') + ext : baseName + '.web' + ext)
  )
}

const hasCorrespondingFileWithHooks = (context) => {
  const filename = context.getFilename()
  const correspondingFiles = getCorrespondingFiles(filename)

  return correspondingFiles.some((file) => {
    if (!fs.existsSync(file)) return false

    try {
      const content = fs.readFileSync(file, 'utf8')
      return /use[A-Z][a-zA-Z]*\s*\([^)]*\)/.test(content)
    } catch (error) {
      console.error(`Error reading file ${file}:`, error)
      return false
    }
  })
}

module.exports = {
  name: 'no-useless-hook',
  meta: {
    docs: {
      description: "Prevent creating hooks that don't use other hooks",
      recommended: true,
    },
    messages: MESSAGES,
  },
  create(context) {
    if (isTestFile(context)) {
      return {}
    }

    if (hasCorrespondingFileWithHooks(context)) {
      return {}
    }

    return {
      FunctionDeclaration(node) {
        if (node.id && isHookName(node.id.name) && !hasHookCall(context)) {
          context.report({
            node,
            messageId: 'noUselessHook',
            data: { name: node.id.name },
          })
        }
      },
      VariableDeclarator(node) {
        if (
          node.init?.type === 'ArrowFunctionExpression' &&
          node.id.name &&
          isHookName(node.id.name) &&
          !hasHookCall(context)
        ) {
          context.report({
            node,
            messageId: 'noUselessHook',
            data: { name: node.id.name },
          })
        }
      },
    }
  },
}

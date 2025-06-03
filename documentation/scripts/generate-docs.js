/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')

const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default

const testPatterns = [/\.native\.test\.tsx$/, /\.native\.test\.ts$/, /\.test\.ts$/]

function matchesPattern(file) {
  return testPatterns.some((regex) => regex.test(file))
}

function extractTests(filePath, relativePath, outputDir) {
  const code = fs.readFileSync(filePath, 'utf8')
  const baseName = path.basename(relativePath, path.extname(relativePath))
  const cleanedName = baseName
    .replace(/\.native\.test$/, '')
    .replace(/\.test$/, '')
    .replace(/\.spec$/, '')
  let output = cleanedName

  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx'],
  })

  const stack = []

  traverse(ast, {
    CallExpression: {
      enter(path) {
        const calleeName = path.node.callee.name
        if (['describe', 'it', 'test'].includes(calleeName)) {
          const arg = path.node.arguments[0]
          if (arg && arg.type === 'StringLiteral') {
            const title = arg.value
            if (calleeName === 'describe') {
              stack.push({ title, children: [] })
            } else {
              if (stack.length > 0) {
                stack[stack.length - 1].children.push(title)
              } else {
                output += '- ${title}\n'
              }
            }
          }
        }
      },
      exit(path) {
        if (path.node.callee.name === 'describe') {
          const block = stack.pop()
          output += `\n ${block.title}\n`
          block.children.forEach((child) => {
            output += `- ${child}\n`
          })
          output += `\n`
        }
      },
    },
  })

  const filename = relativePath.replace(/[/\\]/g, '_') + '.md'
  const outPath = path.join(outputDir, filename)
  fs.writeFileSync(outPath, output)
}

function walk(dir, root, outputDir) {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const fullPath = path.join(dir, file)
    const relPath = path.relative(root, fullPath)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory() && file !== 'node_modules') {
      walk(fullPath, root, outputDir)
    } else if (matchesPattern(file)) {
      extractTests(fullPath, relPath, outputDir)
    }
  }
}

walk('src', 'src', 'documentation/outputs')

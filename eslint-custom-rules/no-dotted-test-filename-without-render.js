/**
 * Enforce a simpler naming for non-UI unit tests.
 *
 * If a test file DOES NOT call `render()` nor `renderHook()`, it must be named:
 *   `*.test.ts`
 * and NOT:
 *   `*.*.test.ts` (e.g. `foo.ios.test.ts`, `bar.native.test.ts`, ...)
 */
const path = require('path')
 
module.exports = {
  name: 'no-dotted-test-filename-without-render',
  meta: {
    docs: {
      description:
        'Non-UI tests (no render/renderHook) must be named *.test.ts and not *.*.test.ts',
    },
    messages: {
      renameTestFile:
        'Ce test ne contient ni `render()` ni `renderHook()`. Il doit être nommé `*.test.ts` (pas `*.*.test.ts`). Renomme `{{ from }}` en `{{ to }}`.',
    },
  },
  create(context) {
    const filename = context.getFilename()
    const absoluteFilename = path.resolve(filename)
    const basename = path.basename(absoluteFilename)
 
    // Only target `.test.ts` files that have an extra dotted segment before `.test.ts`
    // Example: `checkGeolocPermission.ios.test.ts`
    const isDottedTestTs = /.+\.[^.]+\.test\.ts$/.test(basename)
    const isTestTs = basename.endsWith('.test.ts')
    const isIosOrAndroidTestTs = /.+\.(ios|android)\.test\.ts$/.test(basename)
 
    if (!isTestTs || !isDottedTestTs || isIosOrAndroidTestTs) return {}
 
    let hasRenderLikeCall = false
 
    return {
      CallExpression(node) {
        if (hasRenderLikeCall) return
        const callee = node.callee
        if (callee?.type === 'Identifier' && (callee.name === 'render' || callee.name === 'renderHook')) {
          hasRenderLikeCall = true
        }
      },
      'Program:exit'(node) {
        if (hasRenderLikeCall) return
 
        const match = basename.match(/^(.+)\.[^.]+(\.test\.ts)$/)
        if (!match) return
        const suggestedBasename = `${match[1]}${match[2]}`
 
        context.report({
          node,
          messageId: 'renameTestFile',
          data: { from: basename, to: suggestedBasename },
        })
      },
    }
  },
}

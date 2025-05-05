const { RuleTester } = require('eslint')
const rule = require('./no-ts-expect-error')

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

ruleTester.run('no-ts-expect-error', rule, {
  valid: [
    {
      code: `// @ts-expect-error: something else\nconst a = {};`,
      filename: 'test.ts',
    },
    {
      code: `// @ts-ignore\nconst a = {};`,
      filename: 'test.ts',
    },
    {
      code: `/* @ts-expect-error */\nconst a = 1;`,
      filename: 'test.ts',
    },
    {
      code: `// Just a comment\nconst a = 1;`,
      filename: 'test.ts',
    },
  ],
  invalid: [
    {
      code: `// @ts-expect-error: because of noUncheckedIndexedAccess\nconst a = {};`,
      filename: 'test.ts',
      errors: [{ messageId: 'doNotUseTsExpectError', line: 1 }],
    },
    {
      code: `// @ts-expect-error: because of noUncheckedIndexedAccess – optional props\nconst a = {};`,
      filename: 'test.ts',
      errors: [{ messageId: 'doNotUseTsExpectError', line: 1 }],
    },
  ],
})

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
      code: `
        // @ts-expect-error: something else
        const a = {};
      `,
      filename: 'test.ts',
    },
    {
      code: `
        // @ts-ignore
        const a = {};
      `,
      filename: 'test.ts',
    },
    {
      code: `
        /* @ts-expect-error */
        const a = 1;
      `,
      filename: 'test.ts',
    },
    {
      code: `
        // Just a comment
        const a = 1;
      `,
      filename: 'test.ts',
    },
  ],
  invalid: [
    {
      code: `
        // @ts-expect-error: because of noUncheckedIndexedAccess
        const a = {};
      `,
      filename: 'test.ts',
      errors: [{ messageId: 'doNotUseTsExpectError', line: 2 }],
    },
    {
      code: `
        // @ts-expect-error: because of noUncheckedIndexedAccess – optional props
        const a = {};
      `,
      filename: 'test.ts',
      errors: [{ messageId: 'doNotUseTsExpectError', line: 2 }],
    },
  ],
})

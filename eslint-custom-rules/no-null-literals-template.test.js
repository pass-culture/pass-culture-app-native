import { RuleTester } from 'eslint'
import { config } from './config'

import rule from './no-null-literals-template'

const ruleTester = new RuleTester()

const name = 'world'
const foo = null

const tests = {
  valid: [
    { code: '`Hello, ${name}`' },
    { code: '`Number: ${42}`' },
    { code: '`Boolean: ${true}`' },
    { code: '`Undefined: ${undefined}`' },
    { code: '`NullVar: ${nullVar}`' },
  ],
  invalid: [
    {
      code: '`Value: ${null}`',
      errors: [{ message: 'Avoid using `${null}` in template literals.' }],
    },
    {
      code: '`Test: ${foo === null ? null : "bar"}`',
      errors: [{ message: 'Avoid using `${null}` in template literals.' }],
    },
    {
      code: '`Test: ${foo === null ? "bar" : null}`',
      errors: [{ message: 'Avoid using `${null}` in template literals.' }],
    },
  ],
}

tests.valid.forEach((t) => Object.assign(t, config))
tests.invalid.forEach((t) =>
  Object.assign(t, config, {
    errors: [
      {
        message: 'Avoid using `${null}` in template literals.',
      },
    ],
  })
)

ruleTester.run('no-null-literals-template', rule, tests)

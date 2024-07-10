import { RuleTester } from 'eslint'
import { config } from './config'

import rule from './no-empty-arrow-function'

const ruleTester = new RuleTester()

const tests = {
  valid: [
    { code: 'const foo = act(() => {})' },
    { code: 'const bar = () => { console.log("not empty") }' },
    { code: 'const baz = jest.fn()' },
  ],
  invalid: [
    {
      code: 'const foo = () => {}',
      output: 'const foo = jest.fn()',
    },
    {
      code: 'const bar = () => { }',
      output: 'const bar = jest.fn()',
    },
    {
      code: 'const baz = () => { /* empty */ }',
      output: 'const baz = jest.fn()',
    },
    {
      code: 'const qux = () => {/** empty */}',
      output: 'const qux = jest.fn()',
    },
  ],
}

tests.valid.forEach((t) => Object.assign(t, config))
tests.invalid.forEach((t) =>
  Object.assign(t, config, {
    errors: [
      {
        message: 'Use jest.fn() rather than () => {}',
      },
    ],
  })
)

ruleTester.run('no-empty-arrow-function', rule, tests)

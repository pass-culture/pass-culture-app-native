import { RuleTester } from 'eslint'
import { config } from './config'

import rule from './use-ternary-operator-in-jsx'

const ruleTester = new RuleTester()

const tests = {
  valid: [
    { code: 'condition ? <Component /> : null' },
    { code: 'foo === bar ? <Component /> : null' },
    { code: 'foo !== bar ? <Component /> : null' },
    { code: 'condition1 && condition2 ? <Component /> : null' },
    { code: 'condition && foo' },
  ],
  invalid: [
    { code: 'condition && <Component />', output: `condition ? <Component /> : null`
    },
    { code: '!condition && <Component />', output: `!condition ? <Component /> : null` },
    { code: '!!condition && <Component />', output: `!!condition ? <Component /> : null` },
    { code: 'foo === bar && <Component />', output: `foo === bar ? <Component /> : null` },
    { code: 'foo !== bar && <Component />', output: `foo !== bar ? <Component /> : null` },
    { code: 'condition1 && condition2 && <Component />', output: `condition1 && condition2 ? <Component /> : null` },
  ],
}

tests.valid.forEach((t) => Object.assign(t, config))
tests.invalid.forEach((t) =>
  Object.assign(t, config, {
    errors: [
      {
        message: 'Use ternary operator instead of && operator in JSX',
      },
    ],
  })
)

ruleTester.run('use-ternary-operator-in-jsx', rule, tests)

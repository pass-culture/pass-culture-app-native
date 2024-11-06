import { RuleTester } from 'eslint'
import rule from './no-currency-symbols'
import { config } from './config'

const ruleTester = new RuleTester()

const tests = {
  valid: [
    { code: 'const price = "10 USD";' },
    { code: 'const symbol = "$";' },
    { code: '<div>Price: $10</div>', parserOptions: { ecmaFeatures: { jsx: true } } },
    { code: '`Price: $10`' },
  ],

  invalid: [
    { code: `"10€"`, errors: 1 },
    { code: '<div>10€</div>', parserOptions: { ecmaFeatures: { jsx: true } }, errors: 1 },
    { code: '`50€`', errors: 1 },
    { code: `"300\\u00a0€"`, errors: 1 },
    { code: '`300\\u00a0€`', errors: 1 },
    { code: '<Text>300&nbsp;€</Text>', parserOptions: { ecmaFeatures: { jsx: true } }, errors: 1 },
  ],
}

tests.valid.forEach((t) => Object.assign(t, config))
tests.invalid.forEach((t) => Object.assign(t, config))

ruleTester.run('no-currency-symbols', rule, tests)

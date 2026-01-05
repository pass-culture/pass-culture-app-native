import { RuleTester } from 'eslint'
import rule from './no-euro-usage'
import { config } from './config'

const ruleTester = new RuleTester()

const tests = {
  valid: [
    { code: 'const price = "10 USD";' },
    { code: 'const symbol = "$";' },
    { code: '<div>Price: $10</div>', parserOptions: { ecmaFeatures: { jsx: true } } },
    { code: '`Price: $10`' },
    { code: 'const country = "Europe";' },
    { code: 'const word = "européen";' },
    { code: 'const text = "neuroscience";' },
    { code: '<div>Europe</div>', parserOptions: { ecmaFeatures: { jsx: true } } },
    { code: '`Voyage en Europe`' },
  ],

  invalid: [
    { code: `"10€"`, errors: 1 },
    { code: '<div>10€</div>', parserOptions: { ecmaFeatures: { jsx: true } }, errors: 1 },
    { code: '`50€`', errors: 1 },
    { code: `"300\\u00a0€"`, errors: 1 },
    { code: '`300\\u00a0€`', errors: 1 },
    { code: '<Text>300&nbsp;€</Text>', parserOptions: { ecmaFeatures: { jsx: true } }, errors: 1 },
    { code: 'const price = "10 euros";', errors: 1 },
    { code: 'const price = "1 euro";', errors: 1 },
    { code: 'const price = "10 Euro";', errors: 1 },
    { code: 'const price = "10 EUROS";', errors: 1 },
    { code: '<div>10 euros</div>', parserOptions: { ecmaFeatures: { jsx: true } }, errors: 1 },
    { code: '`Total: 10 euros`', errors: 1 },
    { code: '`1 euro seulement`', errors: 1 },
  ],
}

tests.valid.forEach((t) => Object.assign(t, config))
tests.invalid.forEach((t) => Object.assign(t, config))

ruleTester.run('no-euro-usage', rule, tests)

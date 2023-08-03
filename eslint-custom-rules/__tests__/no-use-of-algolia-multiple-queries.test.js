import { RuleTester } from 'eslint'
import { config } from './config'

import rule from '../no-use-of-algolia-multiple-queries'

const ruleTester = new RuleTester()

const tests = {
  valid: [
    { code: "await multipleQueries(queries)" },
  ],
  invalid: [
    {
      code: "await client.multipleQueries(queries)",
      errors: 1,
    },
  ],
}

tests.valid.forEach((t) => Object.assign(t, config))
tests.invalid.forEach((t) => Object.assign(t, config))

ruleTester.run('no-use-of-algolia-multiple-queries', rule, tests)

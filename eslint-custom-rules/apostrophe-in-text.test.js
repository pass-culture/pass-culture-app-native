import { RuleTester } from 'eslint'
import { config } from './config'

import rule from './apostrophe-in-text'

const ruleTester = new RuleTester()

const tests = {
  valid: [{ code: "const str = 'I’m working'" }, { code: '<Text>I’m working</Text>' }],
  invalid: [
    {
      code: `const str = "I'm failing"`,
      output: `const str = "I’m failing"`,
      errors: 1,
    },
    { code: "<Text>I'm failing</Text>", output: '<Text>I’m failing</Text>', errors: 1 },
  ],
}

tests.valid.forEach((t) => Object.assign(t, config))
tests.invalid.forEach((t) => Object.assign(t, config))

ruleTester.run('apostrophe-in-text', rule, tests)

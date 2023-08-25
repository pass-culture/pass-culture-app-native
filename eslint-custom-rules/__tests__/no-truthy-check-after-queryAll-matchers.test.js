import { RuleTester } from 'eslint'
import { config } from './config'

import rule from '../no-truthy-check-after-queryAll-matchers'

const ruleTester = new RuleTester()

const tests = {
  valid: [
    { code: "expect(screen.queryAllByText('Hello world')).not.toHaveLength(0)" },
    { code: "expect(screen.queryByText('Hello world')).toBeTruthy()" },
    { code: "expect(screen.getAllByText('Hello world')).toBeTruthy()" },
    { code: "expect(await screen.findAllByText('Hello world')).toBeTruthy()" },
    { code: 'expect(button).toBeTruthy()' },
  ],
  invalid: [
    {
      code: "expect(screen.queryAllByText('Hello world')).toBeTruthy()",
      errors: 1,
      output: "expect(screen.queryAllByText('Hello world')).not.toHaveLength(0)",
    },
    {
      code: "expect(queryAllByTestId('Hello world')).toBeTruthy()",
      errors: 1,
      output: "expect(queryAllByTestId('Hello world')).not.toHaveLength(0)",
    },
    {
      code: "expect(screen.queryAllByLabelText('Hello world')).toBeTruthy()",
      errors: 1,
      output: "expect(screen.queryAllByLabelText('Hello world')).not.toHaveLength(0)",
    },
    {
      code: "expect(queryAllByPlaceholderText('Hello world')).toBeTruthy()",
      errors: 1,
      output: "expect(queryAllByPlaceholderText('Hello world')).not.toHaveLength(0)",
    },
  ],
}

tests.valid.forEach((t) => Object.assign(t, config))
tests.invalid.forEach((t) => Object.assign(t, config))

ruleTester.run('no-truthy-check-after-queryAll-matchers', rule, tests)

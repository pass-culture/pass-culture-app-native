import { RuleTester } from 'eslint'
import { config } from './config'

import rule from './no-dotted-test-filename-without-render'

const ruleTester = new RuleTester()

const tests = {
  valid: [
    { code: `describe('x', () => {})`, filename: 'toto.test.ts' },
    { code: `describe('x', () => {})`, filename: 'toto.ios.test.ts' },
    { code: `describe('x', () => {})`, filename: 'toto.android.test.ts' },
    { code: `renderHook(() => ({}))`, filename: 'toto.native.test.ts' },
    { code: `describe('x', () => {})`, filename: 'toto.native.test.tsx' },
    { code: `describe('x', () => {})`, filename: 'toto.web.test.tsx' },
  ],
  invalid: [
    {
      code: `it('x', () => { expect(1).toBe(1) })`,
      filename: 'toto.native.test.ts',
      errors: 1,
    },
    {
      code: `it('x', () => { expect(1).toBe(1) })`,
      filename: 'toto.web.test.ts',
      errors: 1,
    },
  ],
}

tests.valid.forEach((t) => Object.assign(t, config))
tests.invalid.forEach((t) => Object.assign(t, config))

ruleTester.run('no-dotted-test-filename-without-render', rule, tests)

import { RuleTester } from 'eslint'
import { config } from './config'

import rule from '../no-hardcoded-id-in-svg'

const ruleTester = new RuleTester()

const tests = {
  valid: [
    { code: '<View />' },
    { code: '<View id="viewId" />' },
    { code: '<ClipPath />' },
    { code: '<ClipPath id={clipPath} />' },
    { code: '<LinearGradient />' },
    { code: '<LinearGradient id={linearGradient} />' },
  ],
  invalid: [
    { code: '<ClipPath id="clip0_3962_10903" />', errors: 1 },
    { code: '<LinearGradient id="clip0_3962_10903" />', errors: 1 },
  ],
}

tests.valid.forEach((t) => Object.assign(t, config))
tests.invalid.forEach((t) => Object.assign(t, config))

ruleTester.run('no-hardcoded-id-in-svg', rule, tests)

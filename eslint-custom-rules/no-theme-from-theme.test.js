import { RuleTester } from 'eslint'
import { config } from './config'

import rule from './no-theme-from-theme'

const ruleTester = new RuleTester()

const tests = {
  valid: [
    { code: "import styled, { useTheme } from 'styled-components/native'" },
    { code: "import { other } from 'theme'" },
  ],
  invalid: [
    { code: "import { AppThemeType, theme } from 'theme'", errors: 1 },
    { code: "import { theme } from 'theme'", errors: 1 },
  ],
}

tests.valid.forEach((t) => Object.assign(t, config))
tests.invalid.forEach((t) => Object.assign(t, config))

ruleTester.run('no-theme-from-theme', rule, tests)

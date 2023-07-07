import { RuleTester } from 'eslint'
import { config } from './config'

import rule from '../use-the-right-test-utils'

const ruleTester = new RuleTester()

const tests = {
  valid: [
    { code: `import { render } from 'tests/utils'`, filename: 'toto.native.test.ts' },
    { code: `import { render } from 'tests/utils/web'`, filename: 'toto.web.test.ts' },
  ],
  invalid: [
    {
      code: `import { render } from 'tests/utils/web'`,
      filename: 'toto.native.test.ts',
      output: "import { render } from 'tests/utils'",
      errors: 1,
    },
    {
      code: `import { render } from 'tests/utils'`,
      filename: 'toto.web.test.ts',
      output: "import { render } from 'tests/utils/web'",
      errors: 1,
    },
  ],
}

tests.valid.forEach((t) => Object.assign(t, config))
tests.invalid.forEach((t) => Object.assign(t, config))

ruleTester.run('use-the-right-test-utils', rule, tests)

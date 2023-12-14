import { RuleTester } from 'eslint'
import { config } from './config'

import rule from '../todo-format'

const ruleTester = new RuleTester()

const tests = {
  valid: [
    { code: `// TODO(PC-12345): test` },
    { code: `// TODO(PC-12345)` },
    { code: `// todo(pc-12345)` },
    { code: `// FIXME(PC-12345)` },
    { code: `// mastodo` },
    { code: `// todon` },
    { code: `// afixme` },
    { code: `// fixmeet` },
  ],
  invalid: [
    { code: `// TODO(foobar)` },
    { code: `// TODO()` },
    { code: `// TODO` },
    { code: `// FIXME(foobar)` },
    { code: `// FIXME()` },
    { code: `// FIXME` },
  ],
}

tests.valid.forEach((t) => Object.assign(t, config))
tests.invalid.forEach((t) =>
  Object.assign(t, config, {
    errors: [
      {
        message: `Wrong TODO/FIXME format. Accepted formats:\n TODO(PC-12345): … \n FIXME(PC-12345): … \n`,
      },
    ],
  })
)

ruleTester.run('todo-format', rule, tests)

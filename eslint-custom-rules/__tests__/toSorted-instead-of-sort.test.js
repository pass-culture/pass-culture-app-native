import { RuleTester } from 'eslint'
import { config } from './config'

import rule from '../toSorted-instead-of-sort'

const ruleTester = new RuleTester()

const tests = {
  valid: [{ code: 'array.toSorted()' }, { code: 'sortArray.toSorted()' }],
  invalid: [
    {
      code: 'array.sort()',
      errors: [
        {
          suggestions: [
            {
              output: 'array.toSorted()',
            },
          ],
        },
      ],
    },
    { 
      code: 'sortArray.sort()',
      errors: [
        {
          suggestions: [
            {
              output: 'sortArray.toSorted()',
            },
          ],
        },
      ],
    },
  ],
}

tests.valid.forEach((t) => Object.assign(t, config))
tests.invalid.forEach((t) => Object.assign(t, config))

ruleTester.run('toSorted-instead-of-sort', rule, tests)

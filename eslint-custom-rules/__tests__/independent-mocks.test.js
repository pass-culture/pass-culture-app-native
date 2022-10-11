import { RuleTester } from 'eslint'
import { config } from './config'

import rule from '../independent-mocks'

const ruleTester = new RuleTester()

const tests = {
  valid: [
    // OK: mock outside of it() declaration
    {
      code: `myFunction.mockImplementation(() => {})
    it('should do something', () => {
      // my test
    })
    `,
    },
    {
      code: `myFunction.mockReturnValue(() => {})
    it('should do something', () => {
      // my test
    })
    `,
    },
    {
      code: `myFunction.mockResolvedValue(() => {})
    it('should do something', () => {
      // my test
    })
    `,
    },
    {
      code: `myFunction.mockRejectedValue(() => {})
    it('should do something', () => {
      // my test
    })
    `,
    },

    // OK: mock once inside of it() declaration
    {
      code: `it('should do something', () => {
        myFunction.mockImplementationOnce(() => {})
      // my test
    })
    `,
    },
    {
      code: `it('should do something', () => {
        myFunction.mockReturnValueOnce(() => {})
      // my test
    })
    `,
    },
    {
      code: `it('should do something', () => {
        myFunction.mockResolvedValueOnce(() => {})
      // my test
    })
    `,
    },
    {
      code: `it('should do something', () => {
        myFunction.mockRejectedValueOnce(() => {})
      // my test
    })
    `,
    },
  ],
  invalid: [
    // KO: mock inside of it() declaration
    {
      code: `it('should do something', () => {
      myFunction.mockImplementation(() => {})
      // my test
    })`,
      errors: [
        {
          message:
            'Use mockImplementation outside it() definition, or use mockImplementationOnce instead',
        },
      ],
    },
    {
      code: `it('should do something', () => {
      myFunction.mockReturnValue(() => {})
      // my test
    })`,
      errors: [
        {
          message:
            'Use mockReturnValue outside it() definition, or use mockReturnValueOnce instead',
        },
      ],
    },
    {
      code: `it('should do something', () => {
      myFunction.mockResolvedValue(() => {})
      // my test
    })`,
      errors: [
        {
          message:
            'Use mockResolvedValue outside it() definition, or use mockResolvedValueOnce instead',
        },
      ],
    },
    {
      code: `it('should do something', () => {
      myFunction.mockRejectedValue(() => {})
      // my test
    })`,
      errors: [
        {
          message:
            'Use mockRejectedValue outside it() definition, or use mockRejectedValueOnce instead',
        },
      ],
    },
  ],
}

tests.valid.forEach((t) => Object.assign(t, config))
tests.invalid.forEach((t) => Object.assign(t, config))

ruleTester.run('independent-mocks', rule, tests)

const { RuleTester } = require('eslint')
const rule = require('./no-useless-hook')

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
})

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
}))

const fs = require('fs')
const path = require('path')

describe('no-useless-hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    fs.existsSync.mockReturnValue(false)
    fs.readFileSync.mockReturnValue('')
  })

  it('should not report when a hook uses another hook', () => {
    ruleTester.run('no-useless-hook', rule, {
      valid: [
        {
          code: `
            function useMyHook() {
              const [state, setState] = useState()
              return state
            }
          `,
          filename: 'src/hooks/useMyHook.ts',
        },
      ],
      invalid: [],
    })
  })

  it('should report when a hook does not use any hooks', () => {
    ruleTester.run('no-useless-hook', rule, {
      valid: [],
      invalid: [
        {
          code: `
            function useMyHook() {
              return 'hello'
            }
          `,
          filename: 'src/hooks/useMyHook.ts',
          errors: [
            {
              message:
                '"useMyHook" is named like a hook but doesn\'t use any hooks. Rename it without the "use" prefix.',
            },
          ],
        },
      ],
    })
  })

  it('should ignore test files', () => {
    ruleTester.run('no-useless-hook', rule, {
      valid: [
        {
          code: `
            function useMyHook() {
              return 'hello'
            }
          `,
          filename: 'src/hooks/__tests__/useMyHook.test.ts',
        },
        {
          code: `
            function useMyHook() {
              return 'hello'
            }
          `,
          filename: 'src/hooks/tests/useMyHook.test.tsx',
        },
      ],
      invalid: [],
    })
  })

  it('should ignore mock files', () => {
    ruleTester.run('no-useless-hook', rule, {
      valid: [
        {
          code: `
            function useMyHook() {
              return 'hello'
            }
          `,
          filename: 'src/hooks/__mocks__/useMyHook.ts',
        },
      ],
      invalid: [],
    })
  })

  describe('web and native files', () => {
    it('should ignore native file if web file uses hooks', () => {
      fs.existsSync.mockImplementation((file) => file.includes('.web.'))
      fs.readFileSync.mockReturnValue(`
        function useMyHook() {
          const [state] = useState()
          return state
        }
      `)

      ruleTester.run('no-useless-hook', rule, {
        valid: [
          {
            code: `
              function useMyHook() {
                return 'hello'
              }
            `,
            filename: 'src/hooks/useMyHook.ts',
          },
        ],
        invalid: [],
      })
    })

    it('should ignore web file if native file uses hooks', () => {
      fs.existsSync.mockImplementation((file) => !file.includes('.web.'))
      fs.readFileSync.mockReturnValue(`
        function useMyHook() {
          const [state] = useState()
          return state
        }
      `)

      ruleTester.run('no-useless-hook', rule, {
        valid: [
          {
            code: `
              function useMyHook() {
                return 'hello'
              }
            `,
            filename: 'src/hooks/useMyHook.web.ts',
          },
        ],
        invalid: [],
      })
    })

    it('should report on web file if native file does not use hooks', () => {
      fs.existsSync.mockImplementation((file) => !file.includes('.web.'))
      fs.readFileSync.mockReturnValue(`
        function useMyHook() {
          return 'hello'
        }
      `)

      ruleTester.run('no-useless-hook', rule, {
        valid: [],
        invalid: [
          {
            code: `
              function useMyHook() {
                return 'hello'
              }
            `,
            filename: 'src/hooks/useMyHook.web.ts',
            errors: [
              {
                message:
                  '"useMyHook" is named like a hook but doesn\'t use any hooks. Rename it without the "use" prefix.',
              },
            ],
          },
        ],
      })
    })
  })

  it('should handle arrow functions', () => {
    ruleTester.run('no-useless-hook', rule, {
      valid: [
        {
          code: `
            const useMyHook = () => {
              const [state] = useState()
              return state
            }
          `,
          filename: 'src/hooks/useMyHook.ts',
        },
      ],
      invalid: [
        {
          code: `
            const useMyHook = () => {
              return 'hello'
            }
          `,
          filename: 'src/hooks/useMyHook.ts',
          errors: [
            {
              message:
                '"useMyHook" is named like a hook but doesn\'t use any hooks. Rename it without the "use" prefix.',
            },
          ],
        },
      ],
    })
  })
})

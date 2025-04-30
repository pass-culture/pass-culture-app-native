const { RuleTester } = require('eslint')
const rule = require('./no-useless-hook')
const fs = require('fs')
const path = require('path')

jest.mock('fs')

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
})

describe('no-useless-hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    fs.existsSync.mockReturnValue(false)
    fs.readFileSync.mockReturnValue('')
  })

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
      {
        code: `
          function useMyHook() {
            return 'hello'
          }
        `,
        filename: 'src/hooks/__mocks__/useMyHook.ts',
      },
      {
        code: `
          const useMyHook = () => {
            const [state] = useState()
            return state
          }
        `,
        filename: 'src/hooks/useMyHook.ts',
      },
      {
        code: `
          function usehook() {
            return 'hello'
          }
        `,
        filename: 'src/hooks/usehook.ts',
      },
      {
        code: `
          const usehook = () => {
            return 'hello'
          }
        `,
        filename: 'src/hooks/usehook.ts',
      },
    ],
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

describe('should ignore web file if native file uses hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    fs.existsSync.mockImplementation((file) => {
      return file === 'src/hooks/useMyHook.ts'
    })
    fs.readFileSync.mockReturnValue(`
        function useMyHook() {
          const [state] = useState()
          return state
        }
      `)
  })

  ruleTester.run('web-native-test', rule, {
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

describe('should ignore native file if web file uses hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    fs.existsSync.mockImplementation((file) => {
      return file === 'src/hooks/useMyHook.ts'
    })
    fs.readFileSync.mockReturnValue(`
        function useMyHook() {
          const [state] = useState()
          return state
        }
      `)
  })

  ruleTester.run('web-native-test', rule, {
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

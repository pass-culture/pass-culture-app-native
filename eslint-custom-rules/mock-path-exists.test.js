const { RuleTester } = require('eslint')
const path = require('path')
const originalRule = require('./mock-path-exists')

const config = {
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      parserOpts: {
        plugins: [['estree', { classFeatures: true }], 'jsx'],
      },
    },
  },
}

const fs = require('fs')
const mockDirs = {}

jest.spyOn(fs, 'existsSync').mockImplementation((filePath) => {
  return !!mockDirs[filePath]
})

const projectRoot = process.cwd()
const srcPath = path.join(projectRoot, 'src')
const nodeModulesPath = path.join(projectRoot, 'node_modules')

mockDirs[path.join(srcPath, 'components/Button')] = true
mockDirs[path.join(srcPath, 'components/Button.tsx')] = true
mockDirs[path.join(nodeModulesPath, 'react')] = true
mockDirs[path.join(srcPath, 'utils')] = true

const testFileDir = path.join(projectRoot, 'src/components')
mockDirs[path.join(testFileDir, 'Button')] = true
mockDirs[path.join(testFileDir, 'utils')] = true

const rule = {
  meta: originalRule.meta,
  create: (context) => {
    const wrappedContext = new Proxy(context, {
      get(target, prop) {
        if (prop === 'getFilename') {
          return () => context.filename || path.join(projectRoot, 'src/components/Test.tsx')
        }
        return target[prop]
      },
    })
    return originalRule.create(wrappedContext)
  },
}

const ruleTester = new RuleTester(config)

const tests = {
  valid: [
    {
      code: `jest.mock('components/Button')`,
      filename: path.join(process.cwd(), 'src/components/Test.tsx'),
    },
    {
      code: `jest.mock('./Button')`,
      filename: path.join(process.cwd(), 'src/components/Test.tsx'),
    },
    {
      code: `jest.mock('react')`,
      filename: path.join(process.cwd(), 'src/Test.tsx'),
    },
    {
      code: `jest.mock('../utils')`,
      filename: path.join(process.cwd(), 'src/components/Test.tsx'),
    },
  ],
  invalid: [
    {
      code: `jest.mock('components/DoesNotExist')`,
      filename: path.join(process.cwd(), 'src/components/Test.tsx'),
      errors: [
        {
          message: 'The path "components/DoesNotExist" in jest.mock() is not found',
        },
      ],
    },
    {
      code: `jest.mock('components/Button.tsx')`,
      filename: path.join(process.cwd(), 'src/components/Test.tsx'),
      errors: [
        {
          message:
            'The path "components/Button.tsx" in jest.mock() should not include a file extension',
        },
      ],
    },
    {
      code: `jest.mock('./DoesNotExist')`,
      filename: path.join(process.cwd(), 'src/components/Test.tsx'),
      errors: [
        {
          message: 'The path "./DoesNotExist" in jest.mock() is not found',
        },
      ],
    },
    {
      code: `jest.mock('package-does-not-exist')`,
      filename: path.join(process.cwd(), 'src/Test.tsx'),
      errors: [
        {
          message: 'The path "package-does-not-exist" in jest.mock() is not found',
        },
      ],
    },
  ],
}

ruleTester.run('jest-mock-path-exists', rule, tests)

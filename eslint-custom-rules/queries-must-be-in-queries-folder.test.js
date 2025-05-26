const { RuleTester } = require('eslint')
const rule = require('./queries-must-be-in-queries-folder')

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

const mockContext = {
  getFilename: () => '',
  getSourceCode: () => ({ ast: {} }),
}

const createValidTest = (filename) => ({
  code: '// test',
  filename,
  errors: [],
})

const createInvalidTest = (filename) => ({
  code: '// test',
  filename,
  errors: [{ messageId: 'mustBeInQueriesFolder' }],
})

const validFilenames = [
  '/src/queries/useGetDataQuery.js',
  '/src/queries/nested/folder/useGetDataQuery.js',
  '/src/queries/useUpdateDataMutation.js',
  '/src/queries/nested/folder/useUpdateDataMutation.js',
  '/src/queries/useGetDataQuery.ts',
  '/src/features/offers/queries/useGetDataQuery.ts',
  '/src/queries/useUpdateDataMutation.tsx',
  '/src/queries/nested/folder/useUpdateDataMutation.tsx',
  '/src/components/Button.tsx',
  '/src/queries/Button.tsx',
]

const invalidFilenames = [
  '/src/components/useGetDataQuery.js',
  '/src/useGetDataQuery.js',
  '/src/useUpdateDataMutation.js',
  '/src/components/useUpdateDataMutation.js',
  '/src/components/useGetDataQuery.ts',
  '/src/useGetDataQuery.ts',
  '/src/useUpdateDataMutation.tsx',
  '/src/components/useUpdateDataMutation.tsx',
]

ruleTester.run('queries-must-be-in-queries-folder', rule, {
  valid: validFilenames.map(createValidTest),
  invalid: invalidFilenames.map(createInvalidTest),
})

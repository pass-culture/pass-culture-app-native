const { RuleTester } = require('eslint')
const rule = require('./queries-must-be-in-queries-folder')

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

// Simuler différents chemins de fichiers
const mockContext = {
  getFilename: () => '',
  getSourceCode: () => ({ ast: {} }),
}

const createTest = (filename, shouldError) => ({
  code: '// test',
  filename,
  errors: shouldError ? [{ messageId: 'mustBeInQueriesFolder' }] : [],
})

ruleTester.run('queries-must-be-in-queries-folder', rule, {
  valid: [
    createTest('/src/queries/useGetDataQuery.js', false),
    createTest('/src/queries/nested/folder/useGetDataQuery.js', false),
    createTest('/src/queries/useUpdateDataMutation.js', false),
    createTest('/src/queries/nested/folder/useUpdateDataMutation.js', false),
    createTest('/src/components/Button.js', false),
    createTest('/src/queries/Button.js', false),
  ],
  invalid: [
    createTest('/src/components/useGetDataQuery.js', true),
    createTest('/src/useGetDataQuery.js', true),
    createTest('/src/useUpdateDataMutation.js', true),
    createTest('/src/components/useUpdateDataMutation.js', true),
  ],
})

const config = require('../.eslintrc.js')

const rules = { ...config.rules }
delete rules['no-restricted-imports']
delete rules['no-restricted-properties']
delete rules['react-native/split-platform-components']
delete rules['react/jsx-fragments']
delete rules['react-native/no-raw-text']

module.exports = {
  ...config,
  root: true,
  plugins: ['typescript-sort-keys', 'eslint-plugin-local-rules'],
  extends: [...config.extends.filter((extend) => !extend.includes('react'))],
  ignorePatterns: ['build', '.*.js', '*.config.js', 'node_modules', 'coverage', '*.test.ts'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  env: {
    node: true,
    jest: true,
  },
  rules,
}

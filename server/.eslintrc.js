const config = require('../.eslintrc.js')

const rules = { ...config.rules }
delete rules['no-restricted-imports']
delete rules['no-restricted-properties']
delete rules['react-native/split-platform-components']

module.exports = {
  ...config,
  root: true,
  plugins: ['typescript-sort-keys', 'eslint-plugin-local-rules'],
  extends: [
    ...config.extends.filter((extend) => !extend.includes('react-native')),
  ],
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
  rules
}

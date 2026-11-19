const globals = require('globals')

const sharedConfig = require('../eslint.config')

module.exports = [
  {
    ignores: [
      '**/node_modules/**',
      '**/build/**',
      '**/coverage/**',
      '**/.yarn/**',
      '**/.*.js',
      '**/*.config.{js,cjs,mjs}',
      '**/*.test.ts',
      'package.json',
    ],
  },
  ...sharedConfig
    .filter((config) => Object.keys(config).some((key) => key !== 'ignores'))
    .map((config) => ({
      ...config,
      ...(config.languageOptions
        ? {
            languageOptions: {
              ...config.languageOptions,
              ecmaVersion: 2020,
              globals: { ...globals.node, ...globals.jest },
              parserOptions: {
                project: ['./tsconfig.json'],
                tsconfigRootDir: __dirname,
              },
            },
          }
        : {}),
    })),
  {
    rules: {
      'no-restricted-imports': 'off',
      'no-restricted-properties': 'off',
      'react-native/split-platform-components': 'off',
      'react/jsx-fragments': 'off',
      'react/jsx-boolean-value': 'off',
      'react/jsx-no-constructed-context-values': 'off',
      'import/no-extraneous-dependencies': 'off',
      'testing-library/await-async-utils': 'off',
      'local-rules/no-euro-usage': 'off',
    },
  },
]

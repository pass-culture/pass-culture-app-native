const { FlatCompat } = require('@eslint/eslintrc')
const js = require('@eslint/js')

const legacyConfig = require('./.eslintrc.js')

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

const legacyExtendsHandledByFlatConfig = new Set([
  'eslint:recommended',
  'plugin:@bam.tech/recommended',
  'plugin:react/recommended',
  'plugin:react-native/all',
  'plugin:@typescript-eslint/recommended',
  'plugin:prettier/recommended',
  'plugin:react-hooks/recommended',
])

const compatConfig = {
  ...legacyConfig,
  extends: legacyConfig.extends.filter((value) => !legacyExtendsHandledByFlatConfig.has(value)),
  plugins: [
    ...legacyConfig.plugins,
    '@typescript-eslint',
    'import',
    'prettier',
    'react',
    'storybook',
    'unused-imports',
  ],
  rules: (() => {
    const { ignoreImports, ...importNoExtraneousDependenciesOptions } =
      legacyConfig.rules['import/no-extraneous-dependencies'][1]

    return {
      ...legacyConfig.rules,
      'import/no-extraneous-dependencies': [
        legacyConfig.rules['import/no-extraneous-dependencies'][0],
        importNoExtraneousDependenciesOptions,
      ],
    }
  })(),
  overrides: legacyConfig.overrides.map((override) => {
    if (override.rules?.['header/header']) {
      const { ['header/header']: _headerRule, ...remainingRules } = override.rules

      return {
        ...override,
        rules: remainingRules,
      }
    }

    if (override.extends === 'plugin:@bam.tech/tests') {
      const { extends: _extends, ...rest } = override

      return rest
    }

    return override
  }),
}

module.exports = [
  {
    ignores: [
      'node_modules',
      'package.json',
      'rn-cli.config.js',
      '.eslintrc.js',
      'android',
      'ios',
      'eslint-local-rules.js',
      'eslint-custom-rules/*',
      'src/api/gen',
      'scripts/parse-perf-results.js',
      'storybook-static',
      'doc/',
      'dist',
    ],
  },
  ...compat.config(compatConfig),
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // Temporarily keep the historical behavior during the ESLint 9 migration.
      '@typescript-eslint/switch-exhaustiveness-check': 'off',
    },
  },
  {
    files: ['src/tests/mockBuilder.ts'],
    rules: {
      'import/no-extraneous-dependencies': 'off',
    },
  },
]

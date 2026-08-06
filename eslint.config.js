const bam = require('@bam.tech/eslint-plugin')
const boundaries = require('eslint-plugin-boundaries')
const header = require('@tony.ganchev/eslint-plugin-header')
const importPlugin = require('eslint-plugin-import')
const localRules = require('eslint-plugin-local-rules')
const reactNative = require('eslint-plugin-react-native')
const sortKeysFix = require('eslint-plugin-sort-keys-fix')
const storybook = require('eslint-plugin-storybook')
const typescriptSortKeys = require('eslint-plugin-typescript-sort-keys')
const unusedImports = require('eslint-plugin-unused-imports')
const globals = require('globals')
const tseslint = require('typescript-eslint')

const { softRules } = require('./eslint-soft-rules')
const { boundariesElements } = require('./eslint-custom-rules/boundaries-rule')

const withPluginMeta = (name, plugin) =>
  plugin.meta ? plugin : { ...plugin, meta: { name, version: '0.0.0' } }

module.exports = [
  {
    ignores: [
      '**/node_modules/**',
      'build/**',
      'coverage/**',
      'server/**',
      'android/**',
      'ios/**',
      'dist/**',
      'doc/**',
      'storybook-static/**',
      'src/api/gen/**',
      '.maestro/**',
      '.github/**',
      '.storybook/**',
      '.yarn/**',
      'package.json',
      'rn-cli.config.js',
      'eslint-local-rules.js',
      'eslint-custom-rules/**',
      'scripts/parse-perf-results.js',
      '*.config.js',
      '.*.js',
    ],
  },

  ...bam.configs.recommended,
  importPlugin.flatConfigs.errors,
  ...storybook.configs['flat/recommended'],

  {
    plugins: {
      boundaries: withPluginMeta('eslint-plugin-boundaries', boundaries),
      header: withPluginMeta('@tony.ganchev/eslint-plugin-header', header),
      'local-rules': withPluginMeta('eslint-plugin-local-rules', localRules),
      'sort-keys-fix': withPluginMeta('eslint-plugin-sort-keys-fix', sortKeysFix),
      'typescript-sort-keys': withPluginMeta(
        'eslint-plugin-typescript-sort-keys',
        typescriptSortKeys
      ),
      'unused-imports': withPluginMeta('eslint-plugin-unused-imports', unusedImports),
    },
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        ...globals.serviceworker,
        ...reactNative.environments['react-native'].globals,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'boundaries/elements': boundariesElements,
      'import/resolver': {
        node: {
          extensions: [
            '.js',
            '.jsx',
            '.android.js',
            '.android.jsx',
            '.ios.js',
            '.ios.jsx',
            '.ts',
            '.d.ts',
            '.tsx',
            '.android.ts',
            '.android.tsx',
            '.ios.ts',
            '.ios.tsx',
            '.mjs',
          ],
        },
        alias: {
          map: [
            // if you change those lines, check this doc https://github.com/pass-culture/pass-culture-app-native/blob/5ff5fba596244a759d60f8c9cdb67d56ac86a1a7/doc/development/alias.md
            ['__mocks__', './__mocks__'],
            ['api', './src/api'],
            ['cheatcodes', './src/cheatcodes'],
            ['features', './src/features'],
            ['fixtures', './src/fixtures'],
            ['libs', './src/libs'],
            ['performance', './src/performance'],
            ['queries', './src/queries'],
            ['shared', './src/shared'],
            ['store', './src/store'],
            ['tests', './src/tests'],
            ['theme', './src/theme'],
            ['types', './src/types'],
            ['ui', './src/ui'],
            ['web', './src/web'],
          ],
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.mjs'],
        },
      },
      'import/ignore': ['node_modules'],
    },
    rules: {
      ...reactNative.configs.all.rules,
      ...boundaries.configs.recommended.rules,

      'react/no-unstable-nested-components': 'error',
      'react/no-unused-prop-types': 'error',
      'local-rules/no-queries-outside-query-files': 'error',
      'react-hooks/use-memo': 'error',
      'local-rules/queries-only-in-use-query-functions': 'error',
      'local-rules/queries-must-be-in-queries-folder': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'local-rules/independent-mocks': 'error',
      'local-rules/no-direct-consult-offer-log': 'error',
      'local-rules/no-theme-from-theme': 'error',
      'local-rules/no-empty-arrow-function': 'off',
      'local-rules/no-fireEvent': 'error',
      'local-rules/no-hardcoded-id-in-svg': 'error',
      'local-rules/no-raw-text': 'error',
      'local-rules/use-ternary-operator-in-jsx': 'error',
      'local-rules/nbsp-in-text': 'error',
      'local-rules/apostrophe-in-text': 'error',
      'local-rules/no-truthy-check-after-queryAll-matchers': 'error',
      'local-rules/todo-format': 'error',
      'local-rules/mock-path-exists': 'error',
      'local-rules/use-the-right-test-utils': 'error',
      'local-rules/no-use-of-algolia-multiple-queries': 'error',
      'local-rules/no-euro-usage': 'error',
      'no-negated-condition': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      // Temporarily keep the historical behavior during the ESLint 9 migration.
      '@typescript-eslint/switch-exhaustiveness-check': 'off',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-ignore': 'allow-with-description',
          'ts-expect-error': 'allow-with-description',
          minimumDescriptionLength: 5,
        },
      ],
      'import/no-duplicates': ['error', { considerQueryString: true }],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'unused-imports/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowAny: true,
        },
      ],
      'react/prop-types': 'off',
      'react-native/sort-styles': 'off',
      'react-native/no-raw-text': 'off',
      'react/jsx-fragments': ['error', 'element'],
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-no-constructed-context-values': 'error',
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'ignore' }],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: '@react-navigation/core', message: 'use @react-navigation/native' },
            { name: 'lottie-react-native', message: 'use libs/lottie instead' },
            { name: 'react-content-loader', message: 'use react-content-loader/native instead' },
            { name: 'react-device-detect', message: 'use libs/react-device-detect instead' },
            {
              name: 'react-native',
              importNames: ['TouchableOpacity', 'Image', 'ImageBackground'],
              message:
                'use instead : ui/components/TouchableOpacity for TouchableOpacity. Image (|| ImageBackground) comes from our backend ? libs/resizing-image-on-demand/Image(||ImageBackground) : Image(||ImageBackground) from react-native',
            },
            {
              name: 'zustand',
              importNames: ['createStore', 'create'],
              message: 'To create a store, use libs/store/createStore instead',
            },
            {
              name: 'react-native-animatable',
              message: 'use libs/react-native-animatable instead',
            },
            {
              name: 'libs/react-native-animatable',
              importNames: ['View', 'Text'],
              message: 'use AnimatedView or AnimatedText instead',
            },
            {
              name: 'react-native-svg',
              importNames: ['default'],
              message: 'use ui/svg/AccessibleSvg instead',
            },
            { name: '@bam.tech/react-native-batch', message: 'use libs/react-native-batch instead' },
            { name: '@react-native-community/netinfo', message: 'use libs/network/netinfo instead' },
            {
              name: 'libs/react-device-detect',
              message:
                'Use theme variables instead, unless you are in a .web module or the theme module, AND the use case applies',
            },
            { name: 'ui/theme/shadow.ios', message: 'use ui/theme instead' },
            { name: 'ui/theme/shadow.android', message: 'use ui/theme instead' },
            {
              name: 'ui/theme/colors',
              message:
                'use theme/index.ts instead, useTheme() | styled(Component).attrs(({ theme }) => ({})`` | styled(Component)(({ theme }) => ({})',
            },
            {
              name: 'ui/theme/layers',
              message:
                'use theme/index.ts instead, useTheme() | styled(Component).attrs(({ theme }) => ({})`` | styled(Component)(({ theme }) => ({})',
            },
            { name: 'msw/lib/types', message: 'use msw instead' },
            { name: '@testing-library/react-native', message: 'Use tests/utils instead' },
            {
              name: 'firebase/compat/firestore',
              message: 'use libs/firebase/shims/firestore instead',
            },
            {
              name: 'firebase/compat/analytics',
              message: 'use libs/firebase/shims/analytics instead',
            },
            {
              name: '@react-native-firebase/analytics',
              message: 'use libs/firebase/shims/analytics instead',
            },
            {
              name: '@react-native-firebase/dynamic-links',
              message: 'use libs/firebase-links instead',
            },
            {
              name: '@react-native-firebase/firestore',
              message: 'use libs/firebase/shims/firestore instead',
            },
            {
              name: '@react-native-firebase/remote-config',
              message: 'use libs/firebase/shims/remote-config instead',
            },
            {
              name: '@react-native-google-signin/google-signin',
              message: 'This library is for native only. Use libs/react-native-google-sso instead',
            },
            {
              name: '@react-oauth/google',
              message: 'This library is for web only. Use libs/react-native-google-sso instead',
            },
            {
              name: 'ui/components/modals/enum',
              message: 'use modal.spacing from theme/index.ts',
            },
            {
              name: '@d11/react-native-fast-image',
              importNames: ['default'],
              message:
                'If images come from our backend, use libs/resizing-image-on-demand/FastImage instead. Otherwise you can use react-native-fast-image',
            },
            {
              name: 'react-native-maps',
              message: 'react-native-maps is not supported on the web. Use libs/maps/maps instead',
            },
            {
              name: 'ui/theme',
              importNames: ['theme'],
              message:
                'Use StyledComponent or import theme via the useTheme() hook instead of directly importing it',
            },
          ],
          patterns: [
            {
              group: ['*.stories*'],
              message: 'you should never import something from a story.',
            },
            {
              group: ['design-system/*'],
              message:
                'use useTheme() | styled(Component).attrs(({ theme }) => ({})`` | styled(Component)(({ theme }) => ({}) when you want yo use design tokens',
            },
          ],
        },
      ],
      'no-restricted-properties': [
        'error',
        {
          object: 'Dimensions',
          property: 'get',
          message:
            'Please use `useTheme().appContentWidth` or `useWindowDimensions().width` instead for dynamic resizing.',
        },
        {
          object: 'Share',
          property: 'share',
          message:
            "Please use the function `share()` from `libs/share` instead for cross-platform support. Don't forget to check `isShareApiSupported()` before using the `share()` function !",
        },
        {
          object: 'window',
          property: 'GeolocationPositionError',
          message: 'Use getWebGeolocErrorFromCode() to support legacy browsers.',
        },
      ],
      'no-restricted-globals': [
        'error',
        {
          name: 'GeolocationPositionError',
          message: 'Use getWebGeolocErrorFromCode() to support legacy browsers.',
        },
      ],
      strict: ['error', 'global'],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'prettier/prettier': 'error',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      semi: 'off',
      /**
       * When dealing with cross-platforms features, linting test files results in error
       * due to a such conflit:
       * - android.test.ts: is not recognized as a android file
       * - test.android.ts: is not recognized as a test file
       * Setting androidPathRegex and iosPathRegex aim to fix that conflict
       */
      'react-native/split-platform-components': [
        'error',
        {
          androidPathRegex: '\\.android(.test)?.(ts|tsx)$',
          iosPathRegex: '\\.ios(.test)?.(ts|tsx)$',
        },
      ],
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/tests/**',
            '**/__tests__/**',
            '**/__mocks__/**',
            '**/*.stories.js',
            '**/*.test.js',
            '**/*.stories.ts',
            '**/*.test.ts',
            '**/*.stories.tsx',
            '**/*.test.tsx',
            '**/*.stories.jsx',
            '**/*.test.jsx',
            '**/service-worker.ts',
            '**/why-did-you-render.js',
            '**/jest.*.ts',
            'dangerfile.ts',
          ],
        },
      ],
      'sort-keys-fix/sort-keys-fix': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      // Rules newly enforced via @bam.tech flat recommended — keep as warnings for now.
      'no-undef': 'off',
      'no-redeclare': 'off',
      'require-await': 'warn',
      'eqeqeq': 'warn',
      'no-else-return': 'warn',
      'no-nested-ternary': 'warn',
      'no-return-await': 'warn',
      'array-callback-return': 'warn',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-shadow': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/no-duplicate-enum-values': 'warn',
      '@typescript-eslint/return-await': 'warn',
      'react/jsx-no-useless-fragment': 'warn',
      '@bam.tech/require-named-effect': 'warn',
      '@bam.tech/no-inline-style': 'warn',
      '@bam.tech/no-different-displayname': 'warn',
      ...softRules,
    },
  },

  {
    files: ['src/ui/designSystem/**/*.{ts,tsx,js,jsx}'],
    rules: {
      'header/header': [
        'warn',
        'block',
        [
          '*',
          ' ⚠️ Design System — Protected file',
          ' Do not edit this file without prior approval from the Design System team.',
          ' ',
        ],
        2,
      ],
    },
  },

  {
    files: ['**/*.stories.tsx'],
    rules: {
      'local-rules/no-euro-usage': 'off',
      'local-rules/no-theme-from-theme': 'off',
    },
  },

  ...bam.configs.tests.map((config) => {
    if (!config.plugins?.jest) {
      return config
    }

    return {
      ...config,
      files: ['**/*.test.ts', '**/*.test.tsx', '__mocks__/**'],
      rules: {
        ...config.rules,
        'local-rules/no-theme-from-theme': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        'local-rules/nbsp-in-text': 'off',
        'local-rules/no-euro-usage': 'off',
        'local-rules/no-empty-arrow-function': 'error',
        'react/jsx-no-constructed-context-values': 'off',
        'jest/prefer-called-with': 'error',
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'warn',
        'jest/no-identical-title': 'error',
        'jest/no-mocks-import': 'off',
        'jest/valid-expect': 'error',
        'jest/expect-expect': ['error', { assertFunctionNames: ['expect', 'measurePerformance'] }],
        'jest/valid-title': ['error', { disallowedWords: [] }],
        'testing-library/no-unnecessary-act': 'off',
        'testing-library/no-wait-for-multiple-assertions': 'off',
        'testing-library/prefer-explicit-assert': 'off',
        'testing-library/await-async-utils': ['error'],
        'testing-library/prefer-screen-queries': ['error'],
        'testing-library/no-await-sync-events': 'off', // TODO(PC-25292): enable when its issues are fixed
        'jest/no-conditional-in-test': 'off', // TODO(PC-25293): enable when its issues are fixed
        '@bam.tech/await-user-event': 'warn',
        '@bam.tech/prefer-user-event': 'warn',
      },
    }
  }),

  {
    files: ['src/tests/mockBuilder.ts'],
    rules: {
      'import/no-extraneous-dependencies': 'off',
    },
  },
]

module.exports = {
  root: true,
  plugins: [
    'react-native',
    'react-hooks',
    'typescript-sort-keys',
    'sort-keys-fix',
    'eslint-plugin-local-rules',
    'testing-library',
    'jest',
  ],
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'eslint:recommended',
    'plugin:@bam.tech/recommended',
    'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
    'plugin:react-native/all', // Enables all rules from react-native
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from @typescript-eslint/eslint-plugin
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    'plugin:import/errors',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  rules: {
    'react/no-unused-prop-types': 'off', // has false positives
    'react/no-unstable-nested-components': 'off', // TODO(PC-25291): enable when its issues are fixed
    'local-rules/independent-mocks': ['error'],
    'local-rules/no-hardcoded-id-in-svg': ['error'],
    'local-rules/no-raw-text': ['error'],
    'local-rules/use-ternary-operator-in-jsx': ['error'],
    'local-rules/nbsp-in-text': ['error'],
    'local-rules/apostrophe-in-text': ['error'],
    'local-rules/no-truthy-check-after-queryAll-matchers': ['error'],
    'local-rules/todo-format': ['error'],
    'local-rules/use-the-right-test-utils': ['error'],
    'local-rules/no-use-of-algolia-multiple-queries': ['error'],
    'no-negated-condition': 'warn',
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-ignore': 'allow-with-description',
        'ts-expect-error': 'allow-with-description',
        minimumDescriptionLength: 5,
      },
    ],
    'import/no-duplicates': ['error', { considerQueryString: true }],
    'no-unused-vars': 'off', // not ideal, but programmatically necessary sometimes

    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    'unused-imports/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'react/prop-types': 'off',
    'react-native/sort-styles': 'off',
    'react-native/no-raw-text': 'off', // We use 'local-rules/no-raw-text' instead
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
            message:
              'To create a store, use libs/store/createStore instead',
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
          {
            name: 'libs/firebase/analytics',
            message:
              'Use analytics from libs/analytics instead, unless you want to use a firebase/amplitude-specific method',
          },
          {
            name: 'libs/amplitude',
            message:
              'Use analytics from libs/analytics instead, unless you want to use a firebase/amplitude-specific method',
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
            name: 'react-native-fast-image',
            importNames: ['default'],
            message:
              'If images come from our backend, use libs/resizing-image-on-demand/FastImage instead. Otherwise you can use react-native-fast-image',
          },
          {
            name: 'react-native-maps',
            message: 'react-native-maps is not supported on the web. Use libs/maps/maps instead',
          },
        ],
        patterns: [
          {
            group: ['*.stories*'],
            message: 'you should never import something from a story.',
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
    semi: 'off', // no semicolons, as in prettier
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
        // This is features available with patch-package on eslint-plugin-import
        // Open PR: https://github.com/import-js/eslint-plugin-import/pull/2557/files
        ignoreImports: [
          './__mocks__',
          './src/tests',
          './src/features/cheatcodes/pages/AppComponents/IconsContainer.tsx',
        ],
      },
    ],
    'sort-keys-fix/sort-keys-fix': 'off',
  },
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
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
          ['api', './src/api'],
          ['features', './src/features'],
          ['fixtures', './src/fixtures'],
          ['libs', './src/libs'],
          ['shared', './src/shared'],
          ['theme', './src/theme'],
          ['types', './src/types'],
          ['tests', './src/tests'],
          ['ui', './src/ui'],
          ['web', './src/web'],
          ['__mocks__', './__mocks__'],
        ],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.mjs'],
      },
    },
    'import/ignore': ['node_modules'],
  },
  env: {
    'react-native/react-native': true,
    node: true,
    browser: true,
    jest: true,
    serviceworker: true,
  },
  ignorePatterns: ['/build', '.*.js', '*.config.js', 'node_modules', '/coverage', '/server'],
  // TypeScript files overrides
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx', '**/*.test.ts', '**/*.test.tsx'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/ban-ts-comment': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-non-null-assertion': 'error', // Disable obj!.propert statements
        '@typescript-eslint/semi': 'off', // let's insist on no semicolons
        '@typescript-eslint/indent': 'off', // turn off typescript indentation and let prettier do its job
        // no semicolons or commas in class/interface definitions
        '@typescript-eslint/member-delimiter-style': [
          'error',
          { multiline: { delimiter: 'none' } },
        ],
        '@typescript-eslint/no-use-before-define': 'off', // Clean Code : caller before callee
        '@typescript-eslint/no-var-requires': 'off', // ES6 imports are more readable
        // we want interface names to start with "I"
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'interface',
            format: ['PascalCase'],
            custom: { regex: '^I[A-Z]', match: true },
          },
        ],
        'typescript-sort-keys/interface': 'error', // Alphabetical sorting
        'typescript-sort-keys/string-enum': 'error', // Alphabetical sorting
      },
    },
  ],

  // Test overrides
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '__mocks__'],
      env: { jest: true },
      extends: 'plugin:@bam.tech/tests',
      rules: {
        '@typescript-eslint/no-empty-function': 'off',
        'local-rules/nbsp-in-text': 'off',
        'react/jsx-no-constructed-context-values': 'off',
        'jest/prefer-called-with': 'warn',
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
      },
    },
  ],
}

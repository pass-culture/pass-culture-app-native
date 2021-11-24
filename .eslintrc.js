module.exports = {
  plugins: ['react-native', 'react-hooks', 'typescript-sort-keys', 'eslint-plugin-local-rules'],
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'eslint:recommended',
    'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
    'plugin:react-native/all', // Enables all rules from react-native
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from @typescript-eslint/eslint-plugin
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    'plugin:import/errors',
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
    'local-rules/no-allow-console': ['error'],
    'local-rules/independant-mocks': ['error'],
    'local-rules/no-string-check-before-component': ['error'],
    'local-rules/no-react-query-provider-hoc': ['error'],
    '@typescript-eslint/ban-ts-comment': [
      2, // error
      {
        'ts-ignore': 'allow-with-description',
        'ts-expect-error': 'allow-with-description',
        minimumDescriptionLength: 5,
      },
    ],
    // not ideal, but progamatically necessary sometimes
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'react/prop-types': 'off',
    'react-native/sort-styles': 'off',
    // This is essential. Without this misplaced hooks would go straight to production
    // since there is no way to detect this during testing.
    'react-hooks/rules-of-hooks': 'error',
    'react/jsx-fragments': ['error', 'element'], // Otherwise `lingui extract` fails when using the shorthand syntax i.e. <></>
    'no-restricted-imports': [
      'error',
      { name: 'styled-components', message: 'Use styled-components/native instead' },
      { name: 'react-content-loader', message: 'use react-content-loader/native instead' },
      { name: 'react-device-detect', message: 'use libs/react-device-detect instead' },
      {
        name: 'libs/react-device-detect',
        message:
          'Use theme variables instead, unless you are in a .web module or the theme module, AND the use case applies',
      },
      { name: 'ui/theme/shadow.ios', message: 'use ui/theme instead' },
      { name: 'ui/theme/shadow.android', message: 'use ui/theme instead' },
      { name: 'msw/lib/types', message: 'use msw instead' },
      { name: '@testing-library/react-native', message: 'Use test/utils instead' },
    ],
    'no-restricted-properties': [
      2,
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
    'prettier/prettier': 'off',
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
      2,
      {
        androidPathRegex: '\\.android(.test)?.(ts|tsx)$',
        iosPathRegex: '\\.ios(.test)?.(ts|tsx)$',
      },
    ],
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
        ],
      },
      alias: {
        map: [
          ['api', './src/api'],
          ['features', './src/features'],
          ['fixtures', './src/fixtures'],
          ['libs', './src/libs'],
          ['theme', './src/theme'],
          ['locales', './src/locales'],
          ['types', './src/types'],
          ['tests', './src/tests'],
          ['ui', './src/ui'],
          ['web', './src/web'],
          ['__mocks__', './__mocks__'],
        ],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
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
  ignorePatterns: ['build', '.*.js', '*.config.js', 'node_modules', 'coverage'],
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
      rules: { '@typescript-eslint/no-empty-function': 'off' },
    },
  ],
}

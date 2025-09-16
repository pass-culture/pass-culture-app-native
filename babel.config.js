module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'macros',
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        cwd: 'babelrc',
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.js', '.ios.js', '.android.js'],
        root: ['./src/'],
        alias: {
          // if you change those lines, check this doc https://github.com/pass-culture/pass-culture-app-native/blob/5ff5fba596244a759d60f8c9cdb67d56ac86a1a7/doc/development/alias.md
          __mocks__: './__mocks__',
          api: './src/api',
          cheatcodes: './src/cheatcodes',
          features: './src/features',
          fixtures: './src/fixtures',
          libs: './src/libs',
          performance: './src/performance',
          queries: './src/queries',
          shared: './src/shared',
          store: './src/store',
          tests: './src/tests',
          theme: './src/theme',
          types: './src/types',
          ui: './src/ui',
          web: './src/web',
        },
      },
    ],
    '@babel/plugin-transform-numeric-separator',
    '@babel/plugin-proposal-unicode-property-regex',
    '@babel/plugin-proposal-export-namespace-from',
    'hot-updater/babel-plugin',
  ],
}

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'macros',
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        cwd: 'babelrc',
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.js', '.ios.js', '.android.js'],
        root: ['./src/'],
        alias: {
          __mocks__: './__mocks__',
          api: './src/api',
          cheatcodes: './src/cheatcodes',
          features: './src/features',
          fixtures: './src/fixtures',
          libs: './src/libs',
          shared: './src/shared',
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
    'react-native-reanimated/plugin',
  ],
}

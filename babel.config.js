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
          api: './src/api',
          features: './src/features',
          fixtures: './src/fixtures',
          libs: './src/libs',
          theme: './src/theme',
          types: './src/types',
          tests: './src/tests',
          ui: './src/ui',
          web: './src/web',
          __mocks__: './__mocks__',
        },
      },
    ],
    '@babel/plugin-proposal-unicode-property-regex',
  ],
}

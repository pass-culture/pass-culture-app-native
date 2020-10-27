module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'macros',
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        cwd: 'babelrc',
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.js', '.ios.js', '.android.js'],
        root: ['./src/', './__mocks__'],
        alias: {
          features: './src/features',
          libs: './src/libs',
          locales: './src/locales',
          types: './src/types',
          tests: './src/tests',
          ui: './src/ui',
          __mocks__: './__mocks__',
        },
      },
    ],
  ],
}

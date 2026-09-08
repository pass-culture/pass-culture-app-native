export const config = {
  languageOptions: {
    parser: require('@babel/eslint-parser'),
    parserOptions: {
      requireConfigFile: false,
      babelOptions: {
        parserOpts: {
          plugins: [['estree', { classFeatures: true }], 'jsx'],
        },
      },
    },
  },
}

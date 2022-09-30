export const config = {
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      parserOpts: {
        plugins: [['estree', { classFeatures: true }], 'jsx'],
      },
    },
  },
}

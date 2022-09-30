const path = require('path')
const paths = require('../web/config/paths')

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
    {
      name: '@storybook/addon-react-native-web',
      options: {
        modulesToAlias: {
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

          'react-native-linear-gradient': 'react-native-web-linear-gradient',
          'react-native-fast-image': path.join(paths.appSrc, 'libs/react-native-web-fast-image'),
          'react-native-email-link': path.join(paths.appSrc, 'libs/react-native-email-link'),
        },
        modulesToTranspile: ['@ptomasroos/react-native-multi-slider'],
      },
    },
  ],
  framework: '@storybook/react',
  webpackFinal: async (config) => {
    config.resolve.alias['react-query'] = require.resolve('./mocks/react-query.js')
    return config
  },
}

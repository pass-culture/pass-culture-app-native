const path = require('path')

const appSrc = path.resolve('./src/')
module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  jest: { testTimeout: 10000 },
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
    {
      name: '@storybook/addon-react-native-web',
      options: {
        modulesToAlias: {
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

          'react-native-linear-gradient': 'react-native-web-linear-gradient',
          'react-native-fast-image': path.join(appSrc, 'libs/react-native-web-fast-image'),
          'react-native-email-link': path.join(appSrc, 'libs/react-native-email-link'),
          'react-native-share': path.join(appSrc, 'libs/react-native-share'),
        },
        modulesToTranspile: ['@ptomasroos/react-native-multi-slider'],
      },
    },
  ],
  framework: '@storybook/react',
  webpackFinal: async (config) => {
    config.resolve.alias['react-query'] = require.resolve('./mocks/react-query.js')
    config.resolve.alias['firebase/compat/app'] = require.resolve('./mocks/firebase.js')
    config.resolve.alias['firebase/remote-config'] = require.resolve('./mocks/remote-config.js')
    return config
  },
}

import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'
import path from 'path'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-native-web-vite',
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  viteFinal: (config) => {
    const excludePlugins = ['vite:html', 'sentry-noop-plugin']

    if (Array.isArray(config.plugins)) {
      config.plugins = config.plugins.filter((plugin) => {
        if (Array.isArray(plugin)) {
          return !plugin.some((p) => excludePlugins.includes((p as any)?.name))
        }
        return !excludePlugins.includes((plugin as any)?.name)
      })
    }

    return mergeConfig(config, {
      optimizeDeps: {
        include: ['react-native-calendars'],
      },
      ssr: {
        noExternal: ['react-native-calendars'],
      },
      resolve: {
        alias: [
          {
            // https://github.com/styled-components/styled-components/issues/5569
            find: 'styled-components/native',
            replacement: 'styled-components/native/dist/styled-components.native.cjs.js',
          },
          {
            find: 'firebase/compat/app',
            replacement: path.resolve('.storybook/__mocks__/firebase.ts'),
          },
          {
            find: 'firebase/remote-config',
            replacement: path.resolve('.storybook/__mocks__/remote-config.ts'),
          },
        ],
      },
    })
  },
}

export default config

import type { StorybookConfig } from '@storybook/react-native-web-vite'
import { mergeConfig } from 'vite'
import path from 'path'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: {
    name:
      // @storybook/react-native-web-vite should be used for both production and developpment
      // doesn't work on dev
      process.env.NODE_ENV === 'production'
        ? '@storybook/react-native-web-vite'
        : '@storybook/react-vite',
    options: {
      pluginBabelOptions: {
        babelConfig: {
          configFile: true,
        },
      },
    },
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
      define: {
        global: 'window',
      },
      build: {
        commonjsOptions: {
          transformMixedEsModules: true,
        },
      },
      optimizeDeps: {
        include: ['react-native-calendars', 'react-native-map-link'],
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

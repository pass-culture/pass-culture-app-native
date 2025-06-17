import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'
import path from 'path'
import babel from 'vite-plugin-babel'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  viteFinal: (config, options) => {
    const isDevelopment = options.configType !== 'PRODUCTION'

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
      plugins: [
        // we need to add this extra babel config because the react plugin doesn't allow
        // for transpiling node_modules. We need this because many react native packages are un-transpiled.
        // see this pr for more context: https://github.com/vitejs/vite-plugin-react/pull/306
        // However we keep the react plugin to get the fast refresh and the other stuff its doing
        babel({
          include: [/node_modules\/(react-native|@react-native)/],
          babelConfig: {
            babelrc: false,
            configFile: true,
            presets: [
              [
                '@babel/preset-react',
                {
                  development: isDevelopment,
                  runtime: 'automatic',
                },
              ],
            ],
            plugins: [
              [
                // this is a fix for reanimated not working in production
                '@babel/plugin-transform-modules-commonjs',
                {
                  strict: false,
                  strictMode: false, // prevent "use strict" injections
                  allowTopLevelThis: true, // dont rewrite global `this` -> `undefined`
                },
              ],
            ],
          },
        }),
      ],
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

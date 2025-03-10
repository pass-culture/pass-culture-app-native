import type { StorybookConfig } from '@storybook/react-vite'
import commonjs from '@rollup/plugin-commonjs'

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
    options: {
      builder: {
        viteConfigPath: 'vite.config.js',
      },
    },
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  viteFinal: async (config) => {
    config.plugins?.push(
      commonjs({
        transformMixedEsModules: true,
      })
    )
    const flatPlugins = Array.isArray(config.plugins) ? config.plugins.flat() : config.plugins || []
    config.plugins = flatPlugins.filter((plugin): boolean => {
      if (!plugin) return false
      return 'name' in plugin && plugin.name !== 'vite:html' && plugin.name !== 'vite:minify-html'
    })

    config.publicDir = 'public'

    return config
  },
}

export default config

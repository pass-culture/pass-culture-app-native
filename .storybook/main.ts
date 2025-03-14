import type { StorybookConfig } from '@storybook/react-vite'
import { PluginOption } from 'vite'
import commonjs from 'vite-plugin-commonjs'

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
    config.plugins = [commonjs(), getPluginsExceptHtmlPlugin(config.plugins)]
    config.publicDir = 'public'
    config.optimizeDeps = {
      ...config.optimizeDeps,
      esbuildOptions: {
        ...config.optimizeDeps?.esbuildOptions,
        format: 'esm',
      },
    }

    return config
  },
}

const getPluginsExceptHtmlPlugin = (plugins: PluginOption[] | undefined) => {
  return plugins?.filter((plugin) => {
    if (Array.isArray(plugin)) {
      return !plugin.some(
        (p) => typeof p === 'object' && p !== null && 'name' in p && p?.name === 'vite:minify-html'
      )
    }
    return true
  })
}

export default config

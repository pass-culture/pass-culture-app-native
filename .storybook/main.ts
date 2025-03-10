import type { StorybookConfig } from '@storybook/react-vite'
import { transformWithEsbuild } from 'vite'

const libsThatHaveJSFilesContainingJSX = [
  'node_modules/react-native-animatable',
  'node_modules/react-native-qrcode-svg',
  'node_modules/@ptomasroos/react-native-multi-slider',
  'node_modules/react-native-calendars',
  'node_modules/react-native-swipe-gestures',
]

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
    options: {
      builder: {
        // viteConfigPath: 'vite.config.js',
      },
    },
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  viteFinal: async (config) => {
    config.publicDir = 'public'

    config.optimizeDeps = { ...config.optimizeDeps, include: ['styled-components'] }
    config.plugins?.push({
      apply: 'build', // This plugin runs only when building (not serve)
      name: 'treat-js-files-as-jsx',
      async transform(code, id) {
        if (!libsThatHaveJSFilesContainingJSX.some((lib) => id.includes(lib))) return null
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
        })
      },
    })

    const defaultExtensions = ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']
    const allExtensions = [...defaultExtensions.map((ext) => `.web${ext}`), ...defaultExtensions]

    config.resolve = {
      extensions: allExtensions,
      alias: [
        {
          find: /^((api|cheatcodes|features|fixtures|libs|queries|shared|theme|ui|web|tests).*)/,
          replacement: '/src/$1',
        },
        {
          find: 'styled-components/native',
          replacement: 'styled-components/native/dist/styled-components.native.cjs.js',
        },
        { find: 'react-native-email-link', replacement: '/src/libs/react-native-email-link' },
        { find: 'react-native-linear-gradient', replacement: 'react-native-web-linear-gradient' },
        { find: 'react-native-fast-image', replacement: '/src/libs/react-native-web-fast-image' },
        { find: 'react-native-share', replacement: '/src/libs/react-native-share' },
      ],
    }
    return config
  },
}

export default config

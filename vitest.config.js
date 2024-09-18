/// <reference types="vitest/config" />

import { defineConfig, loadEnv} from 'vite'

const defaultExtensions = ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']
const allExtensions = [...defaultExtensions.map((ext) => `.web${ext}`), ...defaultExtensions]
const env = loadEnv('testing', process.cwd(), '')

export default defineConfig({
  define: {
    global: 'window',
    'process.env':env,
  },
  resolve: {
    extensions: allExtensions,
    alias: [
      {
        find: /^((api|features|fixtures|libs|shared|theme|ui|web|tests).*)/,
        replacement: '/src/$1',
      },
      { find: 'react-native', replacement: 'react-native-web' },
      {
        find: 'react-native-svg',
        replacement: 'react-native-svg/lib/module/ReactNativeSVG',
      },
    ],
  },
  optimizeDeps: {
    include: ['react-native', 'react-native-web'],
  },
  test: {
    globals: true,
    environment:'jsdom'
  },
})

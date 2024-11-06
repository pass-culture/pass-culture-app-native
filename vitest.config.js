import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

const defaultExtensions = ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']
const allExtensions = [...defaultExtensions.map((ext) => `.web${ext}`), ...defaultExtensions]

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: allExtensions,
    alias: [
      {
        find: /^((api|features|fixtures|libs|shared|theme|ui|web|tests).*)/,
        replacement: '/src/$1',
      },
      { find: 'react-native', replacement: 'react-native-web' },
      {
        find: 'react-native-email-link',
        replacement: '/src/libs/react-native-email-link',
      },
      { find: 'react-native-linear-gradient', replacement: 'react-native-web-linear-gradient' },
      {
        find: 'react-native-fast-image',
        replacement: '/src/libs/react-native-web-fast-image',
      },
      {
        find: 'react-native-share',
        replacement: '/src/libs/react-native-share',
      },
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./setupTests.ts'],
  },
})

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const defaultExtensions = ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']
const allExtensions = [
  ...defaultExtensions.map((ext) => ext.replace(/^\./, '.web.')),
  ...defaultExtensions,
]

export default ({ mode }) => {
  const env = loadEnv(mode === 'development' ? 'testing' : mode, process.cwd(), '')
  return defineConfig({
    define: {
      global: 'window',
      'process.env': env,
      __DEV__: process.env.NODE_ENV !== 'production',
    },
    plugins: [react()],
    resolve: {
      extensions: allExtensions,
      alias: [
        { find: /^((api|features|fixtures|libs|shared|theme|ui|web).*)/, replacement: '/src/$1' },
        { find: 'react-native', replacement: 'react-native-web' },
        {
          find: 'react-native-email-link',
          replacement: resolve(__dirname, 'src/libs/react-native-email-link'),
        },
        { find: 'react-native-linear-gradient', replacement: 'react-native-web-linear-gradient' },
        {
          find: /^react-native-fast-image$/,
          replacement: '/src/libs/react-native-web-fast-image',
        },
        {
          find: 'react-native-share',
          replacement: '/src/libs/react-native-share',
        },
      ],
    },
    esbuild: {
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
    },
    optimizeDeps: {
      include: ['react-native', 'react-native-web'],
      esbuildOptions: {
        jsx: 'transform',
        resolveExtensions: [
          '.web.js',
          '.web.ts',
          '.web.tsx',
          '.js',
          '.jsx',
          '.json',
          '.ts',
          '.tsx',
          '.mjs',
        ],
        loader: {
          '.js': 'jsx',
        },
      },
    },
    build: {
      commonjsOptions: {
        // https://github.com/rollup/plugins/tree/master/packages/commonjs
        // Here go the options to pass on to @rollup/plugin-commonjs:
        transformMixedEsModules: true,
        strictRequires: true, // safest setting 'true', best performance: 'auto'
        extensions: allExtensions,
      },
    },
  })
}

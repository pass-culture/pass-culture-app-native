import { defineConfig, loadEnv, transformWithEsbuild } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import legacy from '@vitejs/plugin-legacy'

const defaultExtensions = ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']
const allExtensions = [
  ...defaultExtensions.map((ext) => ext.replace(/^\./, '.web.')),
  ...defaultExtensions,
]

const libsThatHaveJSFilesContainingJSX = [
  'node_modules/react-native-animatable',
  'node_modules/react-native-qrcode-svg',
  'node_modules/@ptomasroos/react-native-multi-slider',
  'node_modules/react-native-calendars',
  'node_modules/react-native-swipe-gestures',
]

const packageJson = require('./package.json')

export default ({ mode }) => {
  const isDevMode = mode === 'development'
  const isProdMode = mode === 'production'
  const env = loadEnv(isDevMode ? 'testing' : mode, process.cwd(), '')
  const proxyConfig = {
    proxy: {
      '/native': {
        target: env.API_BASE_URL,
        changeOrigin: true,
      },
      '/saml': {
        target: env.API_BASE_URL,
        changeOrigin: true,
      },
    },
  }
  return defineConfig({
    define: {
      global: 'window',
      'process.env': env,
      __DEV__: env.NODE_ENV !== 'production',
    },
    plugins: [
      react(),
      {
        apply: 'build', // This plugin runs only when building (not serve)
        name: 'treat-js-files-as-jsx',
        async transform(code, id) {
          if (!libsThatHaveJSFilesContainingJSX.some((lib) => id.includes(lib))) return null
          // Use the exposed transform from vite, instead of directly transforming with esbuild
          return transformWithEsbuild(code, id, {
            loader: 'jsx',
            jsx: 'automatic',
          })
        },
      },
      createHtmlPlugin({
        minify: true,
        entry: '/src/index.tsx',
        template: 'public/index.html',
        inject: {
          data: {
            TITLE: packageJson.author.name,
            DESCRIPTION: packageJson.description,
            AUTHOR: packageJson.author.name,
            TWITTER_SITE: packageJson.author.twitter,
            META_NO_INDEX:
              env.ENV !== 'production' ? `<meta name="robots" content="noindex" />` : '',
            CHUNK_PROTECTION_SCRIPT: '', // Do we need?
            PUBLIC_URL: isProdMode ? env.APP_PUBLIC_URL : undefined,
            IOS_APP_STORE_ID: env.IOS_APP_STORE_ID,
            ANDROID_APP_ID: env.ANDROID_APP_ID,
            APPS_FLYER_WEB_PUBLIC_KEY: env.APPS_FLYER_WEB_PUBLIC_KEY,
            COMMIT_HASH: env.COMMIT_HASH,
            VERSION: env.VERSION,
          },
          tags: [
            {
              injectTo: 'body-prepend',
              tag: 'div',
              attrs: {
                id: 'tag',
              },
            },
          ],
        },
      }),
      // legacy({
      //   targets: ['defaults', 'not IE 11'],
      // }),
      // Put the Sentry vite plugin after all other plugins
      sentryVitePlugin({
        url: 'https://sentry.passculture.team/',
        org: 'sentry',
        project: 'application-native',
        authToken: env.SENTRY_AUTH_TOKEN, // locally from .env.local, otherwise will come from CI
        release: {
          uploadLegacySourcemaps: {
            paths: ['./dist'],
            ignore: ['node_modules'],
          },
          finalize: env.ENV !== 'testing',
          cleanArtifacts: false,
          name:
            env.ENV === 'testing'
              ? `${packageJson.version}-web-${env.COMMIT_HASH}`
              : `${packageJson.version}-web`,
          dist:
            env.ENV === 'testing'
              ? `${packageJson.build}-web-${env.COMMIT_HASH}`
              : `${packageJson.build}-web`,
          deploy: {
            env: isDevMode ? 'development' : env.ENV,
            name: isDevMode ? 'development' : env.ENV,
            url: env.API_BASE_URL,
          },
        },
      }),
    ],
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
    server: proxyConfig,
    preview: proxyConfig,
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
      sourcemap: true,
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

import { defineConfig, loadEnv, transformWithEsbuild } from 'vite'
import react from '@vitejs/plugin-react'
import { createHtmlPlugin } from 'vite-plugin-html'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { whiteListEnv } from './whiteListEnv'
import { execSync } from 'child_process'

const defaultExtensions = ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']
const allExtensions = [...defaultExtensions.map((ext) => `.web${ext}`), ...defaultExtensions]

const libsThatHaveJSFilesContainingJSX = [
  'node_modules/react-native-animatable',
  'node_modules/react-native-qrcode-svg',
  'node_modules/@ptomasroos/react-native-multi-slider',
  'node_modules/react-native-calendars',
  'node_modules/react-native-swipe-gestures',
]

const packageJson = require('./package.json')

function getGitInfo(command) {
  try {
    return execSync(command).toString().trim()
  } catch (e) {
    console.error(`Failed to execute command: ${command}`, e)
    return 'unknown'
  }
}

const commitHash = getGitInfo('git rev-parse --short HEAD')

export default ({ mode }) => {
  const isDevMode = mode === 'development'
  const isProdMode = mode === 'production'
  const env = loadEnv(isDevMode ? 'testing' : mode, process.cwd(), '')
  const proxyConfig = {
    host: true, // This allows VSCode live share port forwarding
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
      'process.env': whiteListEnv(env, commitHash), // Do not expose the global object directly
      __DEV__: env.NODE_ENV !== 'production',
    },
    plugins: [
      react(),
      {
        apply: 'build', // This plugin runs only when building (not serve)
        name: 'treat-js-files-as-jsx',
        async transform(code, id) {
          if (!libsThatHaveJSFilesContainingJSX.some((lib) => id.includes(lib))) return null
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
            VERSION: packageJson.version,
            AUTHOR: packageJson.author.name,
            TWITTER_SITE: packageJson.author.twitter,
            META_NO_INDEX:
              env.ENV !== 'production' ? `<meta name="robots" content="noindex" />` : '',
            PUBLIC_URL: isProdMode ? env.APP_PUBLIC_URL : undefined,
            IOS_APP_STORE_ID: env.IOS_APP_STORE_ID,
            ANDROID_APP_ID: env.ANDROID_APP_ID,
            APPS_FLYER_WEB_PUBLIC_KEY: env.APPS_FLYER_WEB_PUBLIC_KEY,
            COMMIT_HASH: commitHash,
          },
        },
      }),
      // Put the Sentry vite plugin after all other plugins as specified in plugin's documentation
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
          name: `${packageJson.version}-web`,
          dist: `${packageJson.build}-web-${commitHash}`,
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
    server: proxyConfig,
    preview: proxyConfig,
    optimizeDeps: {
      include: ['react-native', 'react-native-web'],
      esbuildOptions: {
        jsx: 'transform',
        resolveExtensions: allExtensions,
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
        extensions: allExtensions,
      },
    },
  })
}

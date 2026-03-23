import { defineConfig, loadEnv, transformWithOxc } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { whiteListEnv } from './whiteListEnv'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { analyzer } from 'vite-bundle-analyzer'

// Avoid tsc errors, will be corrected after upgrading typescript to 5.6
const react = require('@vitejs/plugin-react').default

const defaultExtensions = ['.js', '.ts', '.mjs', '.mts', '.jsx', '.tsx']
const allExtensions = [...defaultExtensions.map((ext) => `.web${ext}`), ...defaultExtensions, '.json']

const libsThatHaveJSFilesContainingJSX = [
  'node_modules/react-native-animatable',
  'node_modules/react-native-qrcode-svg',
  'node_modules/@ptomasroos/react-native-multi-slider',
  'node_modules/react-native-calendars',
  'node_modules/react-native-swipe-gestures',
  'node_modules/@react-native/assets-registry',
  'node_modules/react-native-reanimated',
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

function parseViteAllowedHosts(env) {
  const raw = process.env.VITE_ALLOWED_HOSTS ?? env.VITE_ALLOWED_HOSTS ?? ''
  const hosts = raw
    .split(',')
    .map((h) => h.trim())
    .filter(Boolean)
  return hosts.length > 0 ? { allowedHosts: hosts } : {}
}

export default ({ mode }) => {
  const isDevMode = mode === 'development'
  const isProdMode = mode === 'production'
  const env = loadEnv(isDevMode ? 'testing' : mode, process.cwd(), '')
  const authToken = env.SENTRY_AUTH_TOKEN ?? process.env.SENTRY_AUTH_TOKEN // First case is for local dev, second for CI

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
  const shouldUploadSourcemaps = process.env.UPLOAD_SOURCEMAPS_TO_SENTRY === 'true' // Set to true in CI

  return defineConfig({
    define: {
      global: 'window',
      'process.env': whiteListEnv(env, commitHash), // Do not expose the global object directly
      __DEV__: env.NODE_ENV !== 'production',
    },
    plugins: [
      {
        name: 'serve-well-known',
        configureServer(server) {
          const publicDir = path.resolve(process.cwd(), 'public')
          const debugAppleSso = process.env.DEBUG_APPLE_SSO === 'true'
          server.middlewares.use((req, res, next) => {
            const pathname = req.url?.split('?')[0]
            if (!pathname?.startsWith('/.well-known/')) {
              return next()
            }
            const filePath = path.resolve(publicDir, pathname.slice(1))
            const relativeToPublic = path.relative(publicDir, filePath)
            if (relativeToPublic.startsWith('..') || path.isAbsolute(relativeToPublic)) {
              return next()
            }
            if (debugAppleSso) {
              console.log(`[serve-well-known] ${pathname}`)
            }
            if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
              if (debugAppleSso) {
                console.warn(`[serve-well-known] File not found: ${filePath}`)
              }
              return next()
            }
            const content = fs.readFileSync(filePath, 'utf-8')
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.setHeader('Content-Length', Buffer.byteLength(content))
            res.statusCode = 200
            res.end(content)
          })
        },
      },
      {
        name: 'apple-sso-callback',
        configureServer(server) {
          server.middlewares.use('/oauth/apple/callback', (req, res, next) => {
            if (req.method !== 'POST') return next()

            let body = ''
            req.on('data', (chunk) => (body += chunk))
            req.on('end', () => {
              const params = new URLSearchParams(body)
              const code = params.get('code') ?? ''
              const state = params.get('state') ?? ''
              const origin = req.headers['x-forwarded-proto']
                ? `${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host']}`
                : `http://${req.headers['host']}`

              res.setHeader('Content-Type', 'text/html; charset=utf-8')
              res.statusCode = 200
              res.end(`<!DOCTYPE html><html><body><script>
                window.opener && window.opener.postMessage(
                  { type: 'apple-sso-callback', code: ${JSON.stringify(code)}, state: ${JSON.stringify(state)} },
                  ${JSON.stringify(origin)}
                );
                window.close();
              </script></body></html>`)
            })
          })
        },
      },
      react(),
      env.ANALYZE_BUNDLE ? analyzer() : null,
      {
        apply: 'build', // This plugin runs only when building (not serve)
        name: 'treat-js-files-as-jsx',
        async transform(code, id) {
          return libsThatHaveJSFilesContainingJSX.some((lib) => id.includes(lib)) ? transformWithOxc(code, id, {
            lang: 'jsx',
            jsx: { runtime: 'automatic' }
          }) : null
        },
      },
      createHtmlPlugin({
        minify: true,
        entry: '/src/index.tsx',
        template: 'src/index.html',
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
        org: 'pass-culture',
        project: 'jeunes',
        disable: !authToken || !shouldUploadSourcemaps,
        authToken,
        release: {
          finalize: env.ENV !== 'testing',
          cleanArtifacts: false,
          name: `${packageJson.version}-web`,
          dist: `${packageJson.build}-web-${commitHash}`,
          deploy: {
            env: isDevMode ? 'development' : env.ENV,
            name: isDevMode ? 'development' : env.ENV,
            url: env.APP_PUBLIC_URL,
          },
        },
      }),
    ],
    resolve: {
      extensions: allExtensions,
      alias: [
        {
          find: /^((api|cheatcodes|features|fixtures|libs|performance|queries|shared|theme|ui|tests|web|store).*)/, // if you change this line, check this doc https://github.com/pass-culture/pass-culture-app-native/blob/5ff5fba596244a759d60f8c9cdb67d56ac86a1a7/doc/development/alias.md
          replacement: '/src/$1',
        },
        // if you add something below, it should also be added to storybook config file in modulesToAlias
        { find: 'react-native', replacement: 'react-native-web' },
        { find: 'react-native-svg', replacement: 'react-native-svg-web' },
        {
          find: 'react-native-email-link',
          replacement: '/src/libs/react-native-email-link',
        },
        { find: 'react-native-linear-gradient', replacement: 'react-native-web-linear-gradient' },
        {
          find: '@d11/react-native-fast-image',
          replacement: '/src/libs/react-native-web-fast-image',
        },
        {
          find: 'react-native-share',
          replacement: '/src/libs/react-native-share',
        },
      ],
    },
    server: { ...proxyConfig, open: true, ...parseViteAllowedHosts(env) },
    preview: proxyConfig,
    optimizeDeps: {
      include: ['react-native', 'react-native-web'],
      rolldownOptions: {
        resolve: {
          extensions: allExtensions,
        },
      },
    },
    build: {
      sourcemap: shouldUploadSourcemaps,
      commonjsOptions: {
        // https://github.com/rollup/plugins/tree/master/packages/commonjs
        // Here go the options to pass on to @rollup/plugin-commonjs:
        transformMixedEsModules: true,
        extensions: allExtensions,
      },
    },
  })
}

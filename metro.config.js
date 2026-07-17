const { getSentryExpoConfig } = require('@sentry/react-native/metro')
const path = require('path')

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
// `getSentryExpoConfig` must be used instead of `withSentryConfig` for Expo projects:
// it injects the Sentry debug id through `unstable_beforeAssetSerializationPlugins`
// instead of replacing Expo's Metro serializer (which breaks release bundling).
const config = getSentryExpoConfig(__dirname)

// expo/src/winter (loaded via getModulesRunBeforeMainModule) needs Web Streams
// (TextDecoderStream extends TransformStream). @expo/metro-config does not ship
// that polyfill — only @expo/cli's withMetroMultiPlatform does (dev server).
// Embedded bundles (Maestro iOS/Android, CI, Hot Updater) therefore crash on Hermes
// with: ReferenceError: Property 'TransformStream' doesn't exist.
const originalGetPolyfills = config.serializer.getPolyfills
config.serializer.getPolyfills = (ctx) => [
  ...(originalGetPolyfills?.(ctx) ?? []),
  require.resolve('expo/virtual/streams.js'),
]

const defaultResolveRequest = config.resolver.resolveRequest
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Mock @vercel/oidc - this package is not compatible with React Native
  // It's a transitive dependency of instantsearch.js -> ai-sdk
  // that requires Node.js-only modules
  // See https://github.com/algolia/instantsearch/issues/6798
  if (moduleName === '@vercel/oidc') {
    return {
      filePath: path.resolve(__dirname, '__mocks__/@vercel/oidc.ts'),
      type: 'sourceFile',
    }
  }
  // Fallback to default resolution
  return (defaultResolveRequest ?? context.resolveRequest)(context, moduleName, platform)
}

module.exports = config

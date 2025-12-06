const path = require('path')
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')

const defaultConfig = getDefaultConfig(__dirname)

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    resolveRequest: (context, moduleName, platform) => {
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
      return context.resolveRequest(context, moduleName, platform)
    },
  },
}

module.exports = mergeConfig(defaultConfig, config)

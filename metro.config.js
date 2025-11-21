const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')

const defaultConfig = getDefaultConfig(__dirname)
const { resolver } = defaultConfig

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */

const config = {
  resolver: {
    ...resolver,
    assetExts: [...resolver.assetExts, 'webp', 'avif'],
  },
}

module.exports = mergeConfig(defaultConfig, config)

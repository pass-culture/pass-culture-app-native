const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    blockList: [
      /*
      Removes the following error that appears sometimes when starting metro

      metro-file-map: Haste module naming collision: @pass-culture/web-proxy
      The following files share their name; please adjust your hasteImpl:
          * <rootDir>/server/package.json
          * <rootDir>/server/build/package.json
      */
      /^\/server/, // ça résout rien du tout, c'est flaky as fuck
    ]
  }
}

module.exports = mergeConfig(getDefaultConfig(__dirname), config)

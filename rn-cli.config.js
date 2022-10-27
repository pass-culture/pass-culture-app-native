const blacklist = require('react-native/packager/blacklist')

module.exports = {
  getBlacklistRE(platform) {
    return blacklist(platform, [
      /build\/.*/,
      /server\/.*/,
      /e2e\/.*/,
    ]);
  },
  getTransformModulePath() {
    return require.resolve('react-native-typescript-transformer');
  },
  getSourceExts() {
    return ['ts', 'tsx'];
  },
};

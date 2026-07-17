module.exports = {
  assets: ['./assets/fonts/'],
  dependencies: {
    'lottie-ios': {
      platforms: {
        ios: null,
      },
    },
    '@batch.com/react-native-plugin': {
      platforms: {
        android: {
          packageInstance: 'new RNBatchPackage(this.getApplication())',
        },
      },
    },
  },
}

module.exports = {
  dependencies: {
    // disable autolinking for these unsupported libraries
    // @codepush
    'react-native-code-push': {
      platforms: {
        android: {
          packageImportPath: 'import com.microsoft.codepush.react.CodePush;',
          packageInstance:
            'new CodePush(BuildConfig.CODEPUSH_KEY, this.getApplication(), BuildConfig.DEBUG)',
        },
      },
    },
  },
};

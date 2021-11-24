import CodePush, { CodePushOptions } from 'react-native-code-push' // @codepush

// useful for testing and staging environments
// to get the up-to-date app all the time
export const AutoImmediate: CodePushOptions = {
  installMode: CodePush.InstallMode.IMMEDIATE,
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
}

// for production environment, we want a more discreet update
// On each app start, we check for update, that we install on
// next app start. This means the app doesn't flicker and the update
// is not visible to the user.
export const NextRestart: CodePushOptions = {
  installMode: CodePush.InstallMode.ON_NEXT_RESTART,
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
}

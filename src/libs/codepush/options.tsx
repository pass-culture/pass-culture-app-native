import CodePush, { CodePushOptions } from 'react-native-code-push' // @codepush

// useful for testing
// to get the up-to-date app all the time
export const AutoImmediate: CodePushOptions = {
  installMode: CodePush.InstallMode.IMMEDIATE,
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
}

const TEN_MINUTES = 60 * 10

// for production environment, we want a more discreet update
// we applied this to staging too.
// On each app start/resume, we check for update, that we install on
// next app start/resume. This means the app doesn't flicker and the update
// is not visible to the user.
// it would seem that this behavior is over-written when setting the CodePush to mandatory via the app center options. If set to mandatory, the CodePush will be applied ASAP (causing flickering)
export const NextResume: CodePushOptions = {
  installMode: CodePush.InstallMode.ON_NEXT_RESUME,
  minimumBackgroundDuration: TEN_MINUTES,
  // Warning : CodePush API usage has a rate limitation of 8 requests per 5 minutes applied.
  // https://learn.microsoft.com/en-us/appcenter/distribution/codepush/
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
}

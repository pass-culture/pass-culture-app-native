import { Platform } from 'react-native'
import CodePush from 'react-native-code-push'

import { env } from 'libs/environment'

import { version, build } from '../../../package.json'

export async function getSentryConfig() {
  let update
  try {
    update = await CodePush.getUpdateMetadata()
  } catch (error) {
    // silent fail
  }

  let release = `${version}-${Platform.OS}`
  if (update) {
    release += `+codepush:${update.label}`
  }
  const dist = `${build}-${Platform.OS}`
  return {
    dsn: env.SENTRY_DSN,
    environment: __DEV__ ? 'development' : env.ENV,
    release,
    dist,
    tracesSampleRate: 0.01,
    attachScreenshot: true,
  }
}

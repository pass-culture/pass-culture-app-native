import { Platform } from 'react-native'
import CodePush from 'react-native-code-push'

import { env } from 'libs/environment'

import { version, build } from '../../../package.json'

export async function getSentryConfig() {
  const update = await CodePush.getUpdateMetadata()
  let dist = `${build}-${Platform.OS}`
  if (update) {
    dist += `-${update.appVersion}+codepush:${update.label}`
  }
  return {
    dsn: env.SENTRY_DSN,
    environment: __DEV__ ? 'development' : env.ENV,
    release: version,
    dist,
    tracesSampleRate: 0.01,
  }
}

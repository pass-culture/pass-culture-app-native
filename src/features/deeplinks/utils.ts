import { Platform } from 'react-native'

import { env } from 'libs/environment'

export function formatDeeplinkDomain() {
  return `${env.URL_PREFIX}://${Platform.OS === 'ios' ? env.IOS_APP_ID : env.ANDROID_APP_ID}/`
}

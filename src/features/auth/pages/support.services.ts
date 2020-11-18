import { Linking } from 'react-native'

import { env } from 'libs/environment'

export async function contactSupport() {
  const url = `mailto:${env.SUPPORT_EMAIL_ADDRESS}`
  const canOpen = await Linking.canOpenURL(url)
  if (canOpen) {
    Linking.openURL(url)
  }
}

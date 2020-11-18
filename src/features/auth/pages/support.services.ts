import { Linking } from 'react-native'

const SUPPORT_EMAIL_ADDRESS = 'support@passculture.app'

export async function contactSupport() {
  const url = `mailto:${SUPPORT_EMAIL_ADDRESS}`
  const canOpen = await Linking.canOpenURL(url)
  if (canOpen) {
    Linking.openURL(url)
  }
}

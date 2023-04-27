import { Linking, Platform } from 'react-native'

import { Network } from 'ui/components/ShareMessagingApp'

const canOpenURL = async (url: string): Promise<boolean> =>
  Platform.OS === 'web' || (await Linking.canOpenURL(url))

// THESE FUNCTIONS ARE ORDERED BY PRIORITY
const checkNetworks = [
  async () => Platform.OS === 'android' && (await canOpenURL('snapchat://')) && Network.snapchat,
  async () => Platform.OS !== 'web' && (await canOpenURL('instagram://user/')) && Network.instagram,
  async () => (await canOpenURL('whatsapp://send/')) && Network.whatsapp,
  async () => Platform.OS === 'android' && (await canOpenURL('sms://')) && Network.googleMessages,
  async () => Platform.OS === 'ios' && (await canOpenURL('sms://')) && Network.imessage,
  async () => Platform.OS !== 'web' && (await canOpenURL('fb-messenger://')) && Network.messenger,
  async () => (await canOpenURL('tg://')) && Network.telegram,
  async () => Platform.OS !== 'web' && (await canOpenURL('viber://forward')) && Network.viber,
  async () => Platform.OS === 'web' && Network.twitter,
]

export const checkIsInstalled = async () => {
  return (await Promise.all(checkNetworks.map((check) => check()))).filter(
    (network) => network
  ) as Network[]
}

const MAX_NB_OF_SOCIALS_TO_SHOW = 10
export const getInstalledApps = async () => {
  return (await checkIsInstalled()).slice(0, MAX_NB_OF_SOCIALS_TO_SHOW)
}

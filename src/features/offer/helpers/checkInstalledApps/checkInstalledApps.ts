import { Platform, Linking } from 'react-native'

import { Network } from 'ui/components/ShareMessagingApp'

export const checkInstalledApps: () => Promise<Record<Network, boolean>> = async () => {
  // ORDERED BY PRIORITY
  const networks = {
    [Network.snapchat]: Platform.OS === 'android' && (await Linking.canOpenURL('snapchat://')), // Only supported on Android
    [Network.instagram]: Platform.OS === 'ios' && (await Linking.canOpenURL('instagram://user/')), // Only supported on iOS
    [Network.whatsapp]: await Linking.canOpenURL('whatsapp://send/'),
    [Network.googleMessages]: Platform.OS === 'android' && (await Linking.canOpenURL('sms://')), // Native to Android
    [Network.imessage]: Platform.OS === 'ios' && (await Linking.canOpenURL('sms://')), // Native to iOS
    [Network.messenger]: await Linking.canOpenURL('fb-messenger://'),
    [Network.telegram]: await Linking.canOpenURL('tg://'),
    [Network.viber]: await Linking.canOpenURL('viber://forward'),
    [Network.twitter]: false, // Only in web
  }
  return networks
}

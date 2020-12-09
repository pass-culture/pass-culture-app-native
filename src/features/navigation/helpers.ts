import { Linking } from 'react-native'

import { RouteParams } from './RootNavigator'
import { TabParamList } from './TabBar/TabNavigator'

export const NavigateToHomeWithoutModalOptions: RouteParams<TabParamList, 'Home'> = {
  shouldDisplayLoginModal: false,
}

export async function openExternalUrl(url: string) {
  const canOpen = await Linking.canOpenURL(url)
  if (canOpen) {
    Linking.openURL(url)
  }
}

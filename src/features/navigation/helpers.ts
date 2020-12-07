import { Linking } from 'react-native'

import { RouteParams } from './RootNavigator'
import { TabParamList } from './TabBar/TabNavigator'

export const NavigateToHomeWithoutModalOptions: RouteParams<TabParamList, 'Home'> = {
  shouldDisplayLoginModal: false,
}

export function openExternalUrl(url: string) {
  if (Linking.canOpenURL(url)) {
    Linking.openURL(url)
  }
}

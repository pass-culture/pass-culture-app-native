import { Route, useNavigationState } from '@react-navigation/native'
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

export function usePreviousRoute(): Route<string> | null {
  return useNavigationState((state) => {
    const numberOfRoutes = state.routes.length
    if (numberOfRoutes > 1) {
      const previousRoute = state.routes[numberOfRoutes - 2]
      return previousRoute
    }
    return null
  })
}

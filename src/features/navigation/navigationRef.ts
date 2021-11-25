import { createNavigationContainerRef } from '@react-navigation/native'

import { RootStackParamList } from 'features/navigation/RootNavigator'

export const navigationRef = createNavigationContainerRef<RootStackParamList>()

export const navigateFromRef = <RouteName extends keyof RootStackParamList>(
  ...args: undefined extends RootStackParamList[RouteName]
    ? [RouteName] | [RouteName, RootStackParamList[RouteName]]
    : [RouteName, RootStackParamList[RouteName]]
) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(...args)
  }
}

export const canGoBackFromRef = () => {
  if (navigationRef.isReady()) {
    return navigationRef.canGoBack()
  }
  return false
}

export const goBackFromRef = () => {
  if (navigationRef.isReady()) {
    navigationRef.goBack()
  }
}

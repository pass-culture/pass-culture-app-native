import { createNavigationContainerRef, StackActions } from '@react-navigation/native'

import { RootStackParamList } from 'features/navigation/RootNavigator/types'

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

export const pushFromRef = <RouteName extends keyof RootStackParamList>(
  ...args: undefined extends RootStackParamList[RouteName]
    ? [RouteName] | [RouteName, RootStackParamList[RouteName]]
    : [RouteName, RootStackParamList[RouteName]]
) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push.apply(null, args))
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

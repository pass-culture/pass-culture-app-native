import { createNavigationContainerRef, StackActions, CommonActions } from '@react-navigation/native'

import { RootStackParamList } from 'features/navigation/RootNavigator/types'

export const navigationRef = createNavigationContainerRef<RootStackParamList>()

export const navigateFromRef = <RouteName extends keyof RootStackParamList>(
  ...args: undefined extends RootStackParamList[RouteName]
    ? [RouteName] | [RouteName, RootStackParamList[RouteName]]
    : [RouteName, RootStackParamList[RouteName]]
) => {
  if (navigationRef.isReady()) {
    // @ts-expect-error TODO(PC-38642): Fix types
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

export const resetFromRef = <RouteName extends keyof RootStackParamList>(
  ...args: undefined extends RootStackParamList[RouteName]
    ? [RouteName] | [RouteName, RootStackParamList[RouteName]]
    : [RouteName, RootStackParamList[RouteName]]
) => {
  if (navigationRef.isReady()) {
    const [name, params] = args
    navigationRef.dispatch(CommonActions.reset({ index: 0, routes: [{ name, params }] }))
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

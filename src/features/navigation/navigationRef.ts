import { createNavigationContainerRef, StackActions, CommonActions } from '@react-navigation/native'

import { RootStackParamList } from 'features/navigation/RootNavigator/types'

export const navigationRef = createNavigationContainerRef<RootStackParamList>()

export const navigateFromRef = <RouteName extends keyof RootStackParamList>(
  ...args: undefined extends RootStackParamList[RouteName]
    ? [RouteName] | [RouteName, RootStackParamList[RouteName]]
    : [RouteName, RootStackParamList[RouteName]]
) => {
  if (navigationRef.isReady()) {
    // TypeScript cannot verify that our union type matches navigate's overloaded signature
    // but the types are structurally correct - we're using the same conditional type pattern
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigationRef.navigate(...(args as any))
  }
}

export const pushFromRef = <RouteName extends keyof RootStackParamList>(
  ...args: undefined extends RootStackParamList[RouteName]
    ? [RouteName] | [RouteName, RootStackParamList[RouteName]]
    : [RouteName, RootStackParamList[RouteName]]
) => {
  if (navigationRef.isReady()) {
    const [name, params] = args
    navigationRef.dispatch(StackActions.push(name, params))
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

import { NavigationContainerRef } from '@react-navigation/native'
import React from 'react'

import { RootStackParamList } from 'features/navigation/RootNavigator'

function isNavRefReady(navRef: NavigationContainerRef | null): navRef is NavigationContainerRef {
  return !!isNavigationReadyRef.current && !!navRef && !!navRef.getRootState()
}

export const navigationRef = React.createRef<NavigationContainerRef>()

export const isNavigationReadyRef = React.createRef<boolean>()

export const navigateFromRef = <RouteName extends keyof RootStackParamList>(
  ...args: undefined extends RootStackParamList[RouteName]
    ? [RouteName] | [RouteName, RootStackParamList[RouteName]]
    : [RouteName, RootStackParamList[RouteName]]
) => {
  const navRef = navigationRef.current
  if (isNavRefReady(navRef)) {
    navRef.navigate(...args)
  }
}

export const setParamsFromRef = (params: Partial<Record<string, string> | undefined>) => {
  const navRef = navigationRef.current
  if (isNavRefReady(navRef)) {
    navRef.setParams(params)
  }
}

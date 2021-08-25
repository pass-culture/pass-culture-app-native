import { NavigationContainer, NavigationContainerRef, Theme } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'

import { RootNavigator } from 'features/navigation/RootNavigator'
import { linking } from 'features/navigation/RootNavigator/linking'
import { ColorsEnum } from 'ui/theme'

import { isNavigationReadyRef, navigationRef } from '../navigationRef'
import { onNavigationStateChange } from '../services'

const NAV_THEME = { colors: { background: ColorsEnum.WHITE } } as Theme

export const AppNavigationContainer = () => {
  const [isRefDefined, setIsRefDefined] = useState(false)

  useEffect(() => {
    return () => {
      /* @ts-expect-error : Cannot assign to 'current' because it is a read-only property. */
      isNavigationReadyRef.current = false
    }
  }, [])

  function setRef(ref: NavigationContainerRef | null) {
    if (ref) {
      /* @ts-expect-error : Cannot assign to 'current' because it is a read-only property. */
      navigationRef.current = ref
      setIsRefDefined(true)
    }
  }

  return (
    <NavigationContainer
      linking={linking}
      onStateChange={onNavigationStateChange}
      ref={setRef}
      onReady={() => {
        /* @ts-expect-error : Cannot assign to 'current' because it is a read-only property. */
        isNavigationReadyRef.current = true
      }}
      theme={NAV_THEME}>
      {isRefDefined ? <RootNavigator /> : null}
    </NavigationContainer>
  )
}

export default AppNavigationContainer

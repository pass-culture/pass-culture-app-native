import { NavigationContainer, NavigationContainerRef, Theme } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'

import { ColorsEnum } from 'ui/theme'

import { isNavigationReadyRef, navigationRef } from './navigationRef'
import { onNavigationStateChange } from './services'

const NAV_THEME = { colors: { background: ColorsEnum.WHITE } } as Theme

export const AppNavigationContainer: React.FC<{ children: Element }> = ({ children }) => {
  const [isRefDefined, setIsRefDefined] = useState(false)

  useEffect(() => {
    return () => {
      /* @ts-ignore : Cannot assign to 'current' because it is a read-only property. */
      isNavigationReadyRef.current = false
    }
  }, [])

  function setRef(ref: NavigationContainerRef | null) {
    if (ref) {
      /* @ts-ignore : Cannot assign to 'current' because it is a read-only property. */
      navigationRef.current = ref
      setIsRefDefined(true)
    }
  }

  return (
    <NavigationContainer
      onStateChange={onNavigationStateChange}
      ref={setRef}
      onReady={() => {
        /* @ts-ignore : Cannot assign to 'current' because it is a read-only property. */
        isNavigationReadyRef.current = true
      }}
      theme={NAV_THEME}>
      {isRefDefined && children}
    </NavigationContainer>
  )
}

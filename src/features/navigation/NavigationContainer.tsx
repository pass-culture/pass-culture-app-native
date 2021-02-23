import { NavigationContainer, NavigationContainerRef, Theme } from '@react-navigation/native'
import React, { useState } from 'react'

import { ColorsEnum } from 'ui/theme'

import { navigationRef } from './navigationRef'
import { onNavigationStateChange } from './services'

const NAV_THEME = { colors: { background: ColorsEnum.WHITE } } as Theme

export const AppNavigationContainer: React.FC<{ children: Element }> = ({ children }) => {
  const [isRefDefined, setIsRefDefined] = useState(false)

  function setRef(ref: NavigationContainerRef | null) {
    if (ref) {
      /* @ts-ignore : Cannot assign to 'current' because it is a read-only property. */
      navigationRef.current = ref
      setIsRefDefined(true)
    }
  }

  return (
    <NavigationContainer onStateChange={onNavigationStateChange} ref={setRef} theme={NAV_THEME}>
      {isRefDefined && children}
    </NavigationContainer>
  )
}

import { NavigationContainer, Theme } from '@react-navigation/native'
import React from 'react'

import { RootNavigator } from 'features/navigation/RootNavigator'
import { linking } from 'features/navigation/RootNavigator/routes'
import { ColorsEnum } from 'ui/theme'

import { navigationRef } from '../navigationRef'
import { onNavigationStateChange } from '../services'

const NAV_THEME = { colors: { background: ColorsEnum.WHITE } } as Theme

export const AppNavigationContainer = () => (
  <NavigationContainer
    linking={linking}
    onStateChange={onNavigationStateChange}
    ref={() => navigationRef}
    theme={NAV_THEME}>
    {navigationRef.current && navigationRef.current.isReady() ? <RootNavigator /> : null}
  </NavigationContainer>
)

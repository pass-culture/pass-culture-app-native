import { NavigationContainer, Theme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React, { useEffect } from 'react'

import { analytics } from 'libs/analytics'
import { ColorsEnum } from 'ui/theme'

import { navigationRef } from '../navigationRef'
import { onNavigationStateChange } from '../services'

import routes from './routes'
import { RootStackParamList, Route } from './types'

export const RootStack = createStackNavigator<RootStackParamList>()

const theme = { colors: { background: ColorsEnum.WHITE } } as Theme

export function wrapRoute(route: Route) {
  if (route.withHocsWrapper) {
    route.component = route.withHocsWrapper(route.component)
  }

  return route
}

const screens = routes
  .map(wrapRoute)
  .map((route: Route) => (
    <RootStack.Screen key={route.name} name={route.name} component={route.component} />
  ))

export const RootNavigator: React.FC = () => {
  useEffect(() => {
    analytics.logScreenView('Home')
  }, [])

  // TODO: check if should display tutorial
  // eslint-disable-next-line no-constant-condition
  const initialRouteName = true ? 'FirstTutorial' : 'TabNavigator'

  return (
    <NavigationContainer onStateChange={onNavigationStateChange} ref={navigationRef} theme={theme}>
      <RootStack.Navigator
        initialRouteName={initialRouteName}
        headerMode="screen"
        screenOptions={{ headerShown: false }}>
        {screens}
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

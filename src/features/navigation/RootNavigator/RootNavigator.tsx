import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { PrivacyPolicy } from 'features/firstLogin/PrivacyPolicy/PrivacyPolicy'
import { navigationRef } from 'features/navigation/navigationRef'
import { useSplashScreenContext } from 'libs/splashscreen'

import routes from './routes'
import { RootStackParamList, Route } from './types'

export const RootStack = createStackNavigator<RootStackParamList>()

export function wrapRoute(route: Route) {
  if (route.hoc) {
    route.component = route.hoc(route.component)
  }
  return route
}

const screens = routes
  .map(wrapRoute)
  .map((route: Route) => (
    <RootStack.Screen
      key={route.name}
      name={route.name}
      component={route.component}
      options={route.options}
    />
  ))

export const RootNavigator: React.FC = () => {
  const { isSplashScreenHidden } = useSplashScreenContext()
  return (
    <React.Fragment>
      <RootStack.Navigator
        initialRouteName={'TabNavigator'}
        headerMode="screen"
        screenOptions={{ headerShown: false }}>
        {screens}
      </RootStack.Navigator>
      {/* The components below are those for which we do not want
      their rendering to happen while the splash is displayed. */}
      {isSplashScreenHidden && <PrivacyPolicy navigationRef={navigationRef} />}
    </React.Fragment>
  )
}

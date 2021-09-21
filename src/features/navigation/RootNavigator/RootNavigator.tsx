import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { PrivacyPolicy } from 'features/firstLogin/PrivacyPolicy/PrivacyPolicy'
import { ForceUpdate } from 'features/forceUpdate/ForceUpdate'
import { useMustUpdateApp } from 'features/forceUpdate/useMustUpdateApp'
import { navigationRef } from 'features/navigation/navigationRef'
import { NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/RootNavigator/navigationOptions'
import { useSplashScreenContext } from 'libs/splashscreen'

import { initialRouteName, routes } from './routes'
import { RootStackParamList, Route } from './types'

export const RootStack = createStackNavigator<RootStackParamList>()
export const MustUpdateRootStack = createStackNavigator<Pick<RootStackParamList, 'ForceUpdate'>>()

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
  const mustUpdateApp = useMustUpdateApp()

  return (
    <React.Fragment>
      {mustUpdateApp ? (
        <MustUpdateRootStack.Navigator
          initialRouteName="ForceUpdate"
          headerMode="screen"
          screenOptions={NAVIGATOR_SCREEN_OPTIONS}>
          <MustUpdateRootStack.Screen name="ForceUpdate" component={ForceUpdate} />
        </MustUpdateRootStack.Navigator>
      ) : (
        <RootStack.Navigator
          initialRouteName={initialRouteName}
          headerMode="screen"
          screenOptions={NAVIGATOR_SCREEN_OPTIONS}>
          {screens}
        </RootStack.Navigator>
      )}
      {/* The components below are those for which we do not want
      their rendering to happen while the splash is displayed. */}
      {!!isSplashScreenHidden && <PrivacyPolicy navigationRef={navigationRef} />}
    </React.Fragment>
  )
}

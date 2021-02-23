import { NavigationContainer, Theme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import CodePush from 'react-native-code-push'

import { PrivacyPolicy } from 'features/firstLogin/PrivacyPolicy/PrivacyPolicy'
import { useCodePush } from 'libs/codepush/CodePushProvider'
import { useHideSplashScreen } from 'libs/splashscreen'
import { ColorsEnum } from 'ui/theme'

import { navigationRef } from '../navigationRef'
import { onNavigationStateChange } from '../services'

import routes from './routes'
import { RootStackParamList, Route } from './types'
import { useGetInitialRouteName } from './useGetInitialRouteName'

export const RootStack = createStackNavigator<RootStackParamList>()

const theme = { colors: { background: ColorsEnum.WHITE } } as Theme

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
  const { status } = useCodePush()
  const initialRouteName = useGetInitialRouteName()

  const isAppReadyToStart = initialRouteName && status === CodePush.SyncStatus.UP_TO_DATE

  const { isSplashScreenHidden } = useHideSplashScreen({
    shouldHideSplashScreen: isAppReadyToStart,
  })

  if (!isAppReadyToStart) return null
  return (
    <NavigationContainer onStateChange={onNavigationStateChange} ref={navigationRef} theme={theme}>
      <RootStack.Navigator
        initialRouteName={initialRouteName}
        headerMode="screen"
        screenOptions={{ headerShown: false }}>
        {screens}
      </RootStack.Navigator>
      {/* The components below are those for which we do not want
      their rendering to happen while the splash is displayed. */}
      {isSplashScreenHidden && <PrivacyPolicy />}
    </NavigationContainer>
  )
}

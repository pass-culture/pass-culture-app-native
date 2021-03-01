import { createStackNavigator } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'

import { useListenDeepLinksEffect } from 'features/deeplinks'
import { PrivacyPolicy } from 'features/firstLogin/PrivacyPolicy/PrivacyPolicy'
import { useHideSplashScreen } from 'libs/splashscreen'

import { navigationRef } from '../navigationRef'

import routes from './routes'
import { RootStackParamList, Route } from './types'
import { useGetInitialScreenConfig } from './useGetInitialScreenConfig'

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
  const [shouldHideSplashScreen, setShouldHideSplashScreen] = useState(false)

  const initialScreenConfig = useGetInitialScreenConfig()
  const { isSplashScreenHidden } = useHideSplashScreen({ shouldHideSplashScreen })

  const isAppReadyToRender = !!initialScreenConfig

  useEffect(() => {
    if (!initialScreenConfig || !navigationRef.current) {
      return
    }
    const { screen, params } = initialScreenConfig
    navigationRef.current.navigate(screen, params)
    setShouldHideSplashScreen(true)
  }, [initialScreenConfig, navigationRef.current])

  useListenDeepLinksEffect()

  return (
    <React.Fragment>
      {isAppReadyToRender && (
        <RootStack.Navigator
          initialRouteName={'TabNavigator'}
          headerMode="screen"
          screenOptions={{ headerShown: false }}>
          {screens}
        </RootStack.Navigator>
      )}
      {/* The components below are those for which we do not want
      their rendering to happen while the splash is displayed. */}
<<<<<<< HEAD
      {isAppReadyToRender && isSplashScreenHidden && <PrivacyPolicy />}
=======
<<<<<<< HEAD
<<<<<<< HEAD
      {isAppReadyToRender && isSplashScreenHidden && <PrivacyPolicy />}
=======
<<<<<<< HEAD
      {isAppReadyToRender && isSplashScreenHidden && navigationRef.current && (
        <PrivacyPolicy navigationRef={navigationRef} />
      )}
=======
      {isSplashScreenHidden && <PrivacyPolicy />}
>>>>>>> 9bb5b511... (PC-7224) Fix navigate issue when Navigator is not yet initialized
>>>>>>> 11dc447b... (PC-7224) Fix navigate issue when Navigator is not yet initialized
=======
      {isAppReadyToRender && isSplashScreenHidden && navigationRef.current && (
        <PrivacyPolicy navigationRef={navigationRef} />
      )}
>>>>>>> 64d80e49... (PC-6926) Tutoriels & Typeform - Ecran paramètres de confidentialité
>>>>>>> 45716c7e... (PC-6926) Tutoriels & Typeform - Ecran paramètres de confidentialité
    </React.Fragment>
  )
}

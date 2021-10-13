import React from 'react'

import { PrivacyPolicy } from 'features/firstLogin/PrivacyPolicy/PrivacyPolicy'
import { navigationRef } from 'features/navigation/navigationRef'
import { NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/RootNavigator/navigationOptions'
import { RootScreenNames } from 'features/navigation/RootNavigator/types'
import { useInitialScreen } from 'features/navigation/RootNavigator/useInitialScreenConfig'
import { withWebWrapper } from 'features/navigation/RootNavigator/withWebWrapper'
import { useSplashScreenContext } from 'libs/splashscreen'
import { LoadingPage } from 'ui/components/LoadingPage'

import { Header } from './Header/Header'
import { RootScreens } from './screens'
import { RootStack } from './Stack'

export const RootStackNavigator = withWebWrapper(
  ({ initialRouteName }: { initialRouteName: RootScreenNames }) => {
    return (
      <RootStack.Navigator
        initialRouteName={initialRouteName}
        headerMode="screen"
        screenOptions={NAVIGATOR_SCREEN_OPTIONS}>
        {RootScreens}
      </RootStack.Navigator>
    )
  }
)

export const RootNavigator: React.ComponentType = () => {
  const { isSplashScreenHidden } = useSplashScreenContext()

  const initialScreen = useInitialScreen()

  if (!initialScreen) {
    return <LoadingPage />
  }
  return (
    <React.Fragment>
      <Header />
      <RootStackNavigator initialRouteName={initialScreen} />
      {/* The components below are those for which we do not want
      their rendering to happen while the splash is displayed. */}
      {!!isSplashScreenHidden && <PrivacyPolicy navigationRef={navigationRef} />}
    </React.Fragment>
  )
}

import React from 'react'

import { PrivacyPolicy } from 'features/firstLogin/PrivacyPolicy/PrivacyPolicy'
import { navigationRef } from 'features/navigation/navigationRef'
import { NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/RootNavigator/navigationOptions'
import { useInitialScreen } from 'features/navigation/RootNavigator/useInitialScreenConfig'
import { useSplashScreenContext } from 'libs/splashscreen'
import { LoadingPage } from 'ui/components/LoadingPage'

import { RootScreens } from './screens'
import { RootStack } from './Stack'

export const RootNavigator: React.FC = () => {
  const { isSplashScreenHidden } = useSplashScreenContext()

  const initialScreen = useInitialScreen()

  if (!initialScreen) {
    return <LoadingPage />
  }
  return (
    <React.Fragment>
      <RootStack.Navigator
        initialRouteName={initialScreen}
        headerMode="screen"
        screenOptions={NAVIGATOR_SCREEN_OPTIONS}>
        {RootScreens}
      </RootStack.Navigator>
      {/* The components below are those for which we do not want
      their rendering to happen while the splash is displayed. */}
      {!!isSplashScreenHidden && <PrivacyPolicy navigationRef={navigationRef} />}
    </React.Fragment>
  )
}

import { t } from '@lingui/macro'
import React from 'react'
import { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { PrivacyPolicy } from 'features/firstLogin/PrivacyPolicy/PrivacyPolicy'
import { AccessibleTabBar } from 'features/navigation/RootNavigator/Header/AccessibleTabBar'
import { NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/RootNavigator/navigationOptions'
import { RootScreenNames } from 'features/navigation/RootNavigator/types'
import { withWebWrapper } from 'features/navigation/RootNavigator/withWebWrapper'
import { TabNavigationStateProvider } from 'features/navigation/TabBar/TabNavigationStateContext'
import { useSplashScreenContext } from 'libs/splashscreen'
import { Main } from 'ui/web/global/Main'
import { QuickAccess } from 'ui/web/link/QuickAccess'

import { Header } from './Header/Header'
import { RootScreens } from './screens'
import { RootStack } from './Stack'

const RootStackNavigator = withWebWrapper(
  ({ initialRouteName }: { initialRouteName: RootScreenNames }) => {
    return (
      <RootStack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={NAVIGATOR_SCREEN_OPTIONS}>
        {RootScreens}
      </RootStack.Navigator>
    )
  }
)

export const RootNavigator: React.ComponentType = () => {
  const mainId = uuidv4()
  const tabBarId = uuidv4()
  const { showTabBar } = useTheme()
  const { isSplashScreenHidden } = useSplashScreenContext()

  const initialScreen = 'FirstTutorial'

  return (
    <TabNavigationStateProvider>
      {showTabBar ? (
        <QuickAccess href={`#${tabBarId}`} title={t`Accéder au menu de navigation`} />
      ) : (
        <Header mainId={mainId} />
      )}
      <Main id={mainId}>
        <RootStackNavigator initialRouteName={initialScreen} />
      </Main>
      {!!showTabBar && <AccessibleTabBar id={tabBarId} />}
      {/* The components below are those for which we do not want
      their rendering to happen while the splash is displayed. */}
      {!!isSplashScreenHidden && <PrivacyPolicy />}
    </TabNavigationStateProvider>
  )
}

import React, { useEffect } from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { PrivacyPolicy } from 'features/cookies/pages/PrivacyPolicy'
import { SuspenseCheatcodesStackNavigator } from 'features/navigation/CheatcodesStackNavigator/SuspenseCheatcodesStackNavigator'
import { useCurrentRoute } from 'features/navigation/helpers/useCurrentRoute'
import { AccessibleTabBar } from 'features/navigation/RootNavigator/Header/AccessibleTabBar'
import { RootScreenNames } from 'features/navigation/RootNavigator/types'
import { useInitialScreen } from 'features/navigation/RootNavigator/useInitialScreenConfig'
import { useShowMandatoryUpdatePersonalData } from 'features/navigation/RootNavigator/useShowMandatoryUpdatePersonalData'
import { withWebWrapper } from 'features/navigation/RootNavigator/withWebWrapper'
import { TabNavigationStateProvider } from 'features/navigation/TabBar/TabNavigationStateContext'
import { TabNavigator } from 'features/navigation/TabBar/TabStackNavigator'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useSplashScreenContext } from 'libs/splashscreen/splashscreen'
import { storage } from 'libs/storage'
import { IconFactoryProvider } from 'ui/components/icons/IconFactoryProvider'
import { LoadingPage } from 'ui/pages/LoadingPage'
import { QuickAccess } from 'ui/web/link/QuickAccess'

import { determineAccessibilityRole } from './determineAccessibilityRole'
import { Header } from './Header/Header'
import { ROOT_NAVIGATOR_SCREEN_OPTIONS } from './navigationOptions'
import { RootStackNavigatorBase } from './Stack'

const RootStackNavigator = withWebWrapper(
  ({ initialRouteName }: { initialRouteName: RootScreenNames }) => (
    <IconFactoryProvider>
      <RootStackNavigatorBase.Navigator
        initialRouteName={initialRouteName}
        screenOptions={ROOT_NAVIGATOR_SCREEN_OPTIONS}>
        <RootStackNavigatorBase.Screen name="TabNavigator" component={TabNavigator} />
        <RootStackNavigatorBase.Screen name="CheatcodesStackNavigator">
          {() => <SuspenseCheatcodesStackNavigator />}
        </RootStackNavigatorBase.Screen>
      </RootStackNavigatorBase.Navigator>
    </IconFactoryProvider>
  )
)

export const RootNavigator: React.ComponentType = () => {
  const mainId = uuidv4()
  const tabBarId = uuidv4()
  const { showTabBar } = useTheme()
  const { isLoggedIn } = useAuthContext()
  const { isSplashScreenHidden } = useSplashScreenContext()

  useShowMandatoryUpdatePersonalData()

  const initialScreen = useInitialScreen()

  const currentRoute = useCurrentRoute()
  const showHeaderQuickAccess = currentRoute && currentRoute.name === 'TabNavigator'
  const headerWithQuickAccess = showHeaderQuickAccess ? (
    <QuickAccess href={`#${tabBarId}`} title="Accéder au menu de navigation" />
  ) : null

  useEffect(() => {
    const incrementLoggedInSessionCount = async () => {
      const loggedInSessionCount =
        (await storage.readObject<number>('logged_in_session_count')) || 0
      await storage.saveObject('logged_in_session_count', loggedInSessionCount + 1)
    }

    if (isLoggedIn) {
      incrementLoggedInSessionCount()
    }
  }, [isLoggedIn])

  if (!initialScreen) {
    return <LoadingPage />
  }

  const mainAccessibilityRole: AccessibilityRole | undefined =
    determineAccessibilityRole(currentRoute)

  return (
    <TabNavigationStateProvider>
      {showTabBar ? headerWithQuickAccess : <Header mainId={mainId} />}
      <Main nativeID={mainId} accessibilityRole={mainAccessibilityRole}>
        <RootStackNavigator initialRouteName={initialScreen} />
      </Main>
      {showTabBar ? (
        <View accessibilityRole={AccessibilityRole.FOOTER}>
          <AccessibleTabBar id={tabBarId} />
        </View>
      ) : null}
      {/* The components below are those for which we do not want their rendering to happen while the splash is displayed. */}
      {isSplashScreenHidden ? <PrivacyPolicy /> : null}
    </TabNavigationStateProvider>
  )
}

const Main = styled.View({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
})

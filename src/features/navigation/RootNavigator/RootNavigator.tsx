import React, { useEffect } from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { PrivacyPolicy } from 'features/cookies/pages/PrivacyPolicy'
import { useCurrentRoute } from 'features/navigation/helpers/useCurrentRoute'
import { AccessibleTabBar } from 'features/navigation/RootNavigator/Header/AccessibleTabBar'
import { ROOT_NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/RootNavigator/navigationOptions'
import { RootScreenNames } from 'features/navigation/RootNavigator/types'
import { useInitialScreen } from 'features/navigation/RootNavigator/useInitialScreenConfig'
import { withWebWrapper } from 'features/navigation/RootNavigator/withWebWrapper'
import { TabNavigationStateProvider } from 'features/navigation/TabBar/TabNavigationStateContext'
import { useLoadAchievement } from 'features/profile/api/Achievements/application/useLoadAchievement'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useSplashScreenContext } from 'libs/splashscreen'
import { storage } from 'libs/storage'
import { IconFactoryProvider } from 'ui/components/icons/IconFactoryProvider'
import { LoadingPage } from 'ui/components/LoadingPage'
import { QuickAccess } from 'ui/web/link/QuickAccess'

import { determineAccessibilityRole } from './determineAccessibilityRole'
import { Header } from './Header/Header'
import { RootScreens } from './screens'
import { RootStack } from './Stack'

const RootStackNavigator = withWebWrapper(
  ({ initialRouteName }: { initialRouteName: RootScreenNames }) => {
    return (
      <IconFactoryProvider>
        <RootStack.Navigator
          initialRouteName={initialRouteName}
          screenOptions={ROOT_NAVIGATOR_SCREEN_OPTIONS}>
          {RootScreens}
        </RootStack.Navigator>
      </IconFactoryProvider>
    )
  }
)

export const RootNavigator: React.ComponentType = () => {
  const mainId = uuidv4()
  const tabBarId = uuidv4()
  const { showTabBar } = useTheme()
  const { isLoggedIn } = useAuthContext()
  const { isSplashScreenHidden } = useSplashScreenContext()
  const { loadAchievements } = useLoadAchievement()

  const initialScreen = useInitialScreen()

  const currentRoute = useCurrentRoute()
  const showHeaderQuickAccess = currentRoute && currentRoute.name === 'TabNavigator'
  const headerWithQuickAccess = showHeaderQuickAccess ? (
    <QuickAccess href={`#${tabBarId}`} title="Accéder au menu de navigation" />
  ) : null

  useEffect(() => {
    loadAchievements()
  }, [loadAchievements])

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
      {/* The components below are those for which we do not want
      their rendering to happen while the splash is displayed. */}
      {isSplashScreenHidden ? <PrivacyPolicy /> : null}
    </TabNavigationStateProvider>
  )
}

const Main = styled.View({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
})

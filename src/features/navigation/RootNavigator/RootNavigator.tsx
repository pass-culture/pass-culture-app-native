import React, { lazy, Suspense, useEffect } from 'react'
import { Platform, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { PrivacyPolicy } from 'features/cookies/pages/PrivacyPolicy'
import { useCurrentRoute } from 'features/navigation/helpers/useCurrentRoute'
import { AccessibleTabBar } from 'features/navigation/RootNavigator/Header/AccessibleTabBar'
import { RootScreenNames } from 'features/navigation/RootNavigator/types'
import { useInitialScreen } from 'features/navigation/RootNavigator/useInitialScreenConfig'
import { withWebWrapper } from 'features/navigation/RootNavigator/withWebWrapper'
import { TabNavigationStateProvider } from 'features/navigation/TabBar/TabNavigationStateContext'
import { VenueMapFiltersStackNavigator } from 'features/navigation/VenueMapFiltersStackNavigator/VenueMapFiltersStackNavigator'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useSplashScreenContext } from 'libs/splashscreen'
import { storage } from 'libs/storage'
import { IconFactoryProvider } from 'ui/components/icons/IconFactoryProvider'
import { LoadingPage } from 'ui/pages/LoadingPage'
import { QuickAccess } from 'ui/web/link/QuickAccess'

import { determineAccessibilityRole } from './determineAccessibilityRole'
import { FILTERS_MODAL_NAV_OPTIONS } from './filtersModalNavOptions'
import { Header } from './Header/Header'
import { ROOT_NAVIGATOR_SCREEN_OPTIONS } from './navigationOptions'
import { RootScreens } from './screens'
import { RootStack } from './Stack'

const isWeb = Platform.OS === 'web'

const CheatcodesStackNavigator = lazy(async () => {
  const module = await import(
    'features/navigation/CheatcodesStackNavigator/CheatcodesStackNavigator'
  )
  return { default: module.CheatcodesStackNavigator }
})

const RootStackNavigator = withWebWrapper(
  ({ initialRouteName }: { initialRouteName: RootScreenNames }) => {
    const { top } = useSafeAreaInsets()
    return (
      <IconFactoryProvider>
        <RootStack.Navigator
          initialRouteName={initialRouteName}
          screenOptions={ROOT_NAVIGATOR_SCREEN_OPTIONS}>
          <RootStack.Screen name="CheatcodesStackNavigator">
            {() => (
              <Suspense fallback={<LoadingPage />}>
                <CheatcodesStackNavigator />
              </Suspense>
            )}
          </RootStack.Screen>
          {isWeb ? null : (
            <RootStack.Screen
              name="VenueMapFiltersStackNavigator"
              component={VenueMapFiltersStackNavigator}
              options={{
                presentation: 'modal',
                ...FILTERS_MODAL_NAV_OPTIONS,
                cardStyle: { marginTop: top, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
              }}
            />
          )}
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

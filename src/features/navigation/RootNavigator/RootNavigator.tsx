import React from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { PrivacyPolicy } from 'features/firstLogin/PrivacyPolicy/PrivacyPolicy'
import { useCurrentRoute } from 'features/navigation/helpers'
import { AccessibleTabBar } from 'features/navigation/RootNavigator/Header/AccessibleTabBar'
import { NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/RootNavigator/navigationOptions'
import { RootScreenNames } from 'features/navigation/RootNavigator/types'
import { useInitialScreen } from 'features/navigation/RootNavigator/useInitialScreenConfig'
import { withWebWrapper } from 'features/navigation/RootNavigator/withWebWrapper'
import { TabNavigationStateProvider } from 'features/navigation/TabBar/TabNavigationStateContext'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useSplashScreenContext } from 'libs/splashscreen'
import { LoadingPage } from 'ui/components/LoadingPage'
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

  const initialScreen = useInitialScreen()

  const currentRoute = useCurrentRoute()
  const showHeaderQuickAccess = currentRoute && currentRoute.name === 'TabNavigator'
  const headerWithQuickAccess = showHeaderQuickAccess ? (
    <QuickAccess href={`#${tabBarId}`} title="Accéder au menu de navigation" />
  ) : null

  if (!initialScreen) {
    return <LoadingPage />
  }

  return (
    <TabNavigationStateProvider>
      {showTabBar ? headerWithQuickAccess : <Header mainId={mainId} />}
      <Main nativeID={mainId} accessibilityRole={AccessibilityRole.MAIN}>
        <RootStackNavigator initialRouteName={initialScreen} />
      </Main>
      {!!showTabBar && (
        <View accessibilityRole={AccessibilityRole.FOOTER}>
          <AccessibleTabBar id={tabBarId} />
        </View>
      )}
      {/* The components below are those for which we do not want
      their rendering to happen while the splash is displayed. */}
      {!!isSplashScreenHidden && <PrivacyPolicy />}
    </TabNavigationStateProvider>
  )
}

const Main = styled.View({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
})

import React, { FunctionComponent, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import 'react-native-gesture-handler' // @react-navigation
import 'react-native-get-random-values' // required for `uuid` module to work
import { LogBox, Platform, StatusBar } from 'react-native'
import CodePush from 'react-native-code-push'

// if __DEV__ import if you want to debug
// import './why-did-you-render'
import 'intl'
import 'intl/locale-data/jsonp/en'

import { AuthWrapper } from 'features/auth/AuthContext'
import { SettingsWrapper } from 'features/auth/SettingsContext'
import { CulturalSurveyContextProvider } from 'features/culturalSurvey/context/CulturalSurveyContextProvider'
import { AsyncErrorBoundaryWithoutNavigation } from 'features/errors/pages/AsyncErrorBoundary'
import { ScreenErrorProvider } from 'features/errors/pages/ScreenErrorProvider'
import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { SubscriptionContextProvider } from 'features/identityCheck/context/SubscriptionContextProvider'
import { AppNavigationContainer } from 'features/navigation/NavigationContainer'
import { PushNotificationsWrapper } from 'features/notifications/askNotificationsModal/helpers/PushNotificationsWrapper'
import { OnboardingWrapper } from 'features/onboarding/context/OnboardingWrapper'
import { SearchWrapper } from 'features/search/context/SearchWrapper'
import { ShareAppWrapper } from 'features/shareApp/context/ShareAppWrapper'
import { initAlgoliaAnalytics } from 'libs/algolia/analytics/initAlgoliaAnalytics'
import { SearchAnalyticsWrapper } from 'libs/algolia/analytics/SearchAnalyticsWrapper'
import { campaignTracker } from 'libs/campaign'
import { AutoImmediate, NextRestart } from 'libs/codepush/options'
import { E2eContextProvider } from 'libs/e2e/E2eContextProvider'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { RemoteConfigProvider } from 'libs/firebase/remoteConfig'
import { GeolocationWrapper } from 'libs/geolocation'
import { eventMonitoring } from 'libs/monitoring'
import { NetInfoWrapper } from 'libs/network/NetInfoWrapper'
import { OfflineModeContainer } from 'libs/network/OfflineModeContainer'
import { BatchMessaging, BatchPush } from 'libs/react-native-batch'
import { SafeAreaProvider } from 'libs/react-native-save-area-provider'
import { ReactQueryClientProvider } from 'libs/react-query/ReactQueryClientProvider'
import { SplashScreenProvider } from 'libs/splashscreen'
import { ThemeProvider } from 'libs/styled'
import { theme } from 'theme'
import { SnackBarProvider } from 'ui/components/snackBar/SnackBarContext'

LogBox.ignoreLogs([
  'Setting a timer',
  'Expected style "elevation:',
  'OfferNotFoundError', // custom error
  // The following warning is caused by TabNavigationContext which is updated by the `tabbar` prop
  // of TabNavigator. As of today, no bug has been observed which seems related to the warning.
  'Cannot update a component',
  'EventEmitter.removeListener',
])

const App: FunctionComponent = function () {
  useEffect(() => {
    StatusBar.setBarStyle('dark-content')
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true)
      StatusBar.setBackgroundColor('transparent', false)
    }
  }, [])

  campaignTracker.useInit()
  analytics.useInit()

  useEffect(() => {
    eventMonitoring.init({ enabled: !__DEV__ })
  }, [])

  useEffect(() => {
    initAlgoliaAnalytics()
    BatchPush.requestNotificationAuthorization() //  For iOS and Android 13
    BatchMessaging.setFontOverride('Montserrat-Regular', 'Montserrat-Bold', 'Montserrat-Italic')
  }, [])

  return (
    <RemoteConfigProvider>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider>
          <ReactQueryClientProvider>
            <ErrorBoundary FallbackComponent={AsyncErrorBoundaryWithoutNavigation}>
              {/* All react-query calls should be nested inside NetInfoWrapper to ensure the user has internet connection */}
              <E2eContextProvider>
                <NetInfoWrapper>
                  <SettingsWrapper>
                    <AuthWrapper>
                      <GeolocationWrapper>
                        <FavoritesWrapper>
                          <SearchAnalyticsWrapper>
                            <SearchWrapper>
                              <SnackBarProvider>
                                <CulturalSurveyContextProvider>
                                  <SubscriptionContextProvider>
                                    <SplashScreenProvider>
                                      <PushNotificationsWrapper>
                                        <ShareAppWrapper>
                                          <OnboardingWrapper>
                                            <OfflineModeContainer>
                                              <ScreenErrorProvider>
                                                <AppNavigationContainer />
                                              </ScreenErrorProvider>
                                            </OfflineModeContainer>
                                          </OnboardingWrapper>
                                        </ShareAppWrapper>
                                      </PushNotificationsWrapper>
                                    </SplashScreenProvider>
                                  </SubscriptionContextProvider>
                                </CulturalSurveyContextProvider>
                              </SnackBarProvider>
                            </SearchWrapper>
                          </SearchAnalyticsWrapper>
                        </FavoritesWrapper>
                      </GeolocationWrapper>
                    </AuthWrapper>
                  </SettingsWrapper>
                </NetInfoWrapper>
              </E2eContextProvider>
            </ErrorBoundary>
          </ReactQueryClientProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </RemoteConfigProvider>
  )
}

const config = env.ENV !== 'production' ? AutoImmediate : NextRestart
const AppWithCodepush = __DEV__ ? App : CodePush(config)(App)

export { AppWithCodepush as App }

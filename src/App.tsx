import 'intl'
import 'intl/locale-data/jsonp/en'
import { HotUpdater, getUpdateSource } from '@hot-updater/react-native'
import React, { FunctionComponent, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { LogBox } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-get-random-values' // required for `uuid` module to work

// if __DEV__ import if you want to debug
// import './why-did-you-render'

import { AccessibilityFiltersWrapper } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { AuthWrapper } from 'features/auth/context/AuthWrapper'
import { CulturalSurveyContextProvider } from 'features/culturalSurvey/context/CulturalSurveyContextProvider'
import { AsyncErrorBoundaryWithoutNavigation } from 'features/errors/pages/AsyncErrorBoundaryWithoutNavigation'
import { ScreenErrorProvider } from 'features/errors/pages/ScreenErrorProvider'
import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { SubscriptionContextProvider } from 'features/identityCheck/context/SubscriptionContextProvider'
import { AppNavigationContainer } from 'features/navigation/NavigationContainer'
import { SearchWrapper } from 'features/search/context/SearchWrapper'
import { ShareAppWrapper } from 'features/share/context/ShareAppWrapper'
import { initAlgoliaAnalytics } from 'libs/algolia/analytics/initAlgoliaAnalytics'
import { env } from 'libs/environment/env'
import { AnalyticsInitializer } from 'libs/firebase/analytics/AnalyticsInitializer'
import { FirestoreNetworkObserver } from 'libs/firebase/firestore/FirestoreNetworkObserver/FirestoreNetworkObserver'
import { LocationWrapper } from 'libs/location/location'
import { eventMonitoring } from 'libs/monitoring/services'
import { NetInfoWrapper } from 'libs/network/NetInfoWrapper'
import { OfflineModeContainer } from 'libs/network/OfflineModeContainer'
import { BatchMessaging, BatchPush } from 'libs/react-native-batch'
import { configureGoogleSignin } from 'libs/react-native-google-sso/configureGoogleSignin'
import { SafeAreaProvider } from 'libs/react-native-save-area-provider'
import { ReactQueryClientProvider } from 'libs/react-query/ReactQueryClientProvider'
import { SplashScreenProvider } from 'libs/splashscreen/splashscreen'
import { ThemeWrapper } from 'libs/styled/ThemeWrapper'
import { useLaunchPerformanceObserver } from 'performance/useLaunchPerformanceObserver'
import { useOrientationLocked } from 'shared/hook/useOrientationLocked'
import { SnackBarWrapper } from 'ui/designSystem/Snackbar/SnackBarWrapper'

LogBox.ignoreLogs([
  'Setting a timer',
  'OfferNotFoundError', // custom error
  // The following warning is caused by TabNavigationContext which is updated by the `tabbar` prop
  // of TabNavigator. As of today, no bug has been observed which seems related to the warning.
  'Cannot update a component',
  'EventEmitter.removeListener',
])

const App: FunctionComponent = function () {
  useLaunchPerformanceObserver()

  useOrientationLocked()

  useEffect(() => {
    void eventMonitoring.init({ enabled: !__DEV__ })
  }, [])

  useEffect(() => {
    initAlgoliaAnalytics()
    BatchPush.refreshToken() //  Synchronizes the user's iOS token with Batch. Should be called at each app launch. No effect on Android.
    BatchMessaging.setFontOverride('Montserrat-Regular', 'Montserrat-Bold', 'Montserrat-Italic')
    configureGoogleSignin({
      webClientId: env.GOOGLE_CLIENT_ID,
      iosClientId: env.GOOGLE_IOS_CLIENT_ID,
      offlineAccess: true,
    })
  }, [])

  return (
    <GestureHandlerRootView>
      <ReactQueryClientProvider>
        <ThemeWrapper>
          <SafeAreaProvider>
            <ErrorBoundary FallbackComponent={AsyncErrorBoundaryWithoutNavigation}>
              <AnalyticsInitializer>
                {/* All react-query calls should be nested inside NetInfoWrapper to ensure the user has internet connection */}
                <NetInfoWrapper>
                  <FirestoreNetworkObserver />
                  <AuthWrapper>
                    <LocationWrapper>
                      <AccessibilityFiltersWrapper>
                        <FavoritesWrapper>
                          <SearchWrapper>
                            <SnackBarWrapper>
                              <CulturalSurveyContextProvider>
                                <SubscriptionContextProvider>
                                  <SplashScreenProvider>
                                    <ShareAppWrapper>
                                      <OfflineModeContainer>
                                        <ScreenErrorProvider>
                                          <AppNavigationContainer />
                                        </ScreenErrorProvider>
                                      </OfflineModeContainer>
                                    </ShareAppWrapper>
                                  </SplashScreenProvider>
                                </SubscriptionContextProvider>
                              </CulturalSurveyContextProvider>
                            </SnackBarWrapper>
                          </SearchWrapper>
                        </FavoritesWrapper>
                      </AccessibilityFiltersWrapper>
                    </LocationWrapper>
                  </AuthWrapper>
                </NetInfoWrapper>
              </AnalyticsInitializer>
            </ErrorBoundary>
          </SafeAreaProvider>
        </ThemeWrapper>
      </ReactQueryClientProvider>
    </GestureHandlerRootView>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWithHotUpdater: any =
  __DEV__ || env.ENV !== 'testing'
    ? App
    : HotUpdater.wrap({
        source: getUpdateSource(`${env.HOT_UPDATER_FUNCTION_URL}/api/check-update`, {
          updateStrategy: 'appVersion',
        }),
      })(App)

export { AppWithHotUpdater as App }

import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import React, { FunctionComponent, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import 'react-native-gesture-handler' // @react-navigation
import 'react-native-get-random-values' // required for `uuid` module to work
import { LogBox } from 'react-native'
import CodePush from 'react-native-code-push'

// if __DEV__ import if you want to debug
// import './why-did-you-render'
import 'intl'
import 'intl/locale-data/jsonp/en'

import { AuthWrapper } from 'features/auth/AuthContext'
import { AsyncErrorBoundaryWithoutNavigation } from 'features/errors/pages/AsyncErrorBoundary'
import { ScreenErrorProvider } from 'features/errors/pages/ScreenErrorProvider'
import { FavoritesWrapper } from 'features/favorites/pages/FavoritesWrapper'
import { IdentityCheckContextProvider } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { AppNavigationContainer } from 'features/navigation/NavigationContainer'
import { SearchWrapper } from 'features/search/pages/SearchWrapper'
import { ABTestingProvider } from 'libs/ABTesting'
import { analytics } from 'libs/analytics'
import { campaignTracker } from 'libs/campaign'
import { AutoImmediate, NextRestart } from 'libs/codepush/options'
import { env } from 'libs/environment'
import { GeolocationWrapper } from 'libs/geolocation'
import { activate } from 'libs/i18n'
import { eventMonitoring } from 'libs/monitoring'
import { NetInfoWrapper } from 'libs/network/NetInfoWrapper'
import { useStartBatchNotification } from 'libs/notifications'
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
  campaignTracker.useInit()
  analytics.useInit()
  useStartBatchNotification()

  useEffect(() => {
    activate('fr')
  }, [])

  useEffect(() => {
    eventMonitoring.init({ enabled: !__DEV__ })
  }, [])

  return (
    <ABTestingProvider>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider>
          <ReactQueryClientProvider>
            <ErrorBoundary FallbackComponent={AsyncErrorBoundaryWithoutNavigation}>
              <AuthWrapper>
                <GeolocationWrapper>
                  <FavoritesWrapper>
                    <SearchWrapper>
                      <I18nProvider i18n={i18n}>
                        <SnackBarProvider>
                          <NetInfoWrapper>
                            <IdentityCheckContextProvider>
                              <SplashScreenProvider>
                                <ScreenErrorProvider>
                                  <AppNavigationContainer />
                                </ScreenErrorProvider>
                              </SplashScreenProvider>
                            </IdentityCheckContextProvider>
                          </NetInfoWrapper>
                        </SnackBarProvider>
                      </I18nProvider>
                    </SearchWrapper>
                  </FavoritesWrapper>
                </GeolocationWrapper>
              </AuthWrapper>
            </ErrorBoundary>
          </ReactQueryClientProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </ABTestingProvider>
  )
}

const config = env.ENV !== 'production' ? AutoImmediate : NextRestart
const AppWithCodepush = __DEV__ ? App : CodePush(config)(App)

export { AppWithCodepush as App }

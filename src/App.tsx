import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import React, { FunctionComponent, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import 'react-native-gesture-handler' // @react-navigation
import 'react-native-get-random-values' // required for `uuid` module to work
import { LogBox } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query'
import { addPlugin } from 'react-query-native-devtools'

import './why-did-you-render'
import 'intl'
import 'intl/locale-data/jsonp/en'

import { AuthWrapper } from 'features/auth/AuthContext'
import { AsyncErrorBoundaryWithoutNavigation } from 'features/errors/pages/AsyncErrorBoundary'
import { FavoritesWrapper } from 'features/favorites/pages/FavoritesWrapper'
import { AppNavigationContainer } from 'features/navigation/NavigationContainer'
import { RootNavigator } from 'features/navigation/RootNavigator'
import { SearchWrapper } from 'features/search/pages/SearchWrapper'
import { ABTestingProvider } from 'libs/ABTesting'
import CodePushProvider from 'libs/codepush/CodePushProvider'
import { errorMonitoring } from 'libs/errorMonitoring'
import { GeolocationWrapper } from 'libs/geolocation'
import { activate } from 'libs/i18n'
import { useStartBatchNotification } from 'libs/notifications'
import { SplashScreenProvider } from 'libs/splashscreen'
import { SnackBarProvider } from 'ui/components/snackBar/SnackBarContext'

LogBox.ignoreLogs(['Setting a timer'])

const queryCache = new QueryCache()

if (__DEV__ && process.env.JEST !== 'true') {
  addPlugin(queryCache)
}
const queryClient = new QueryClient({
  queryCache,
  defaultOptions: {
    queries: {
      retry: 0,
      useErrorBoundary: true,
    },
  },
})

// Disable error monitoring in development environment
errorMonitoring.init({ enabled: !__DEV__ })

const App: FunctionComponent = function () {
  useStartBatchNotification()

  useEffect(() => {
    activate('fr')
  }, [])

  return (
    <ABTestingProvider>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary FallbackComponent={AsyncErrorBoundaryWithoutNavigation}>
            <GeolocationWrapper>
              <AuthWrapper>
                <FavoritesWrapper>
                  <SearchWrapper>
                    <I18nProvider i18n={i18n}>
                      <SnackBarProvider>
                        <SplashScreenProvider>
                          <AppNavigationContainer>
                            <RootNavigator />
                          </AppNavigationContainer>
                        </SplashScreenProvider>
                      </SnackBarProvider>
                    </I18nProvider>
                  </SearchWrapper>
                </FavoritesWrapper>
              </AuthWrapper>
            </GeolocationWrapper>
          </ErrorBoundary>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ABTestingProvider>
  )
}

const AppWithCodepush = __DEV__
  ? App
  : () => (
      <CodePushProvider>
        <App />
      </CodePushProvider>
    )

export { AppWithCodepush as App }

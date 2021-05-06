import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { IdCheckContextProvider, theme } from '@pass-culture/id-check'
import React, { FunctionComponent, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import 'react-native-gesture-handler' // @react-navigation
import 'react-native-get-random-values' // required for `uuid` module to work
import { AppState, AppStateStatus, LogBox } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import {
  focusManager as reactQueryFocusManager,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import { addPlugin } from 'react-query-native-devtools'
import { ThemeProvider } from 'styled-components/native'

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
import { useCampaignTracker } from 'libs/campaign'
import CodePushProvider from 'libs/codepush/CodePushProvider'
import { errorMonitoring } from 'libs/errorMonitoring'
import { GeolocationWrapper } from 'libs/geolocation'
import { activate } from 'libs/i18n'
import { idCheckAnalytics } from 'libs/idCheckAnalytics'
import { useStartBatchNotification } from 'libs/notifications'
import { SplashScreenProvider } from 'libs/splashscreen'
import { SnackBarProvider } from 'ui/components/snackBar/SnackBarContext'

LogBox.ignoreLogs(['Setting a timer', 'Expected style "elevation:'])

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

// By default, on the web, if a user leaves the app and returns to stale data,
// React Query automatically requests fresh data in the background.
// To have the equivalent behaviour for React-Native, we provide focus information through
// the AppState module :
reactQueryFocusManager.setEventListener((handleFocus) => {
  function triggerReactQueryFocusOnBecomeActive(appState: AppStateStatus) {
    if (appState === 'active') {
      handleFocus()
    }
  }
  AppState.addEventListener('change', triggerReactQueryFocusOnBecomeActive)
  return () => {
    AppState.removeEventListener('change', triggerReactQueryFocusOnBecomeActive)
  }
})

const App: FunctionComponent = function () {
  useCampaignTracker()
  useStartBatchNotification()

  useEffect(() => {
    activate('fr')
  }, [])

  useEffect(() => {
    errorMonitoring.init({ enabled: !__DEV__ })
  }, [])

  function onIdCheckSuccess() {
    // eslint-disable-next-line no-console
    console.log('success')
  }

  function onIdCheckAbandon() {
    // eslint-disable-next-line no-console
    console.log('abandon')
  }

  return (
    <ABTestingProvider>
      <SafeAreaProvider>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <AuthWrapper>
              <ErrorBoundary FallbackComponent={AsyncErrorBoundaryWithoutNavigation}>
                <GeolocationWrapper>
                  <FavoritesWrapper>
                    <SearchWrapper>
                      <I18nProvider i18n={i18n}>
                        <SnackBarProvider>
                          <IdCheckContextProvider
                            errorMonitoring={errorMonitoring}
                            analytics={idCheckAnalytics}
                            onSuccess={onIdCheckSuccess}
                            onAbandon={onIdCheckAbandon}>
                            <SplashScreenProvider>
                              <AppNavigationContainer>
                                <RootNavigator />
                              </AppNavigationContainer>
                            </SplashScreenProvider>
                          </IdCheckContextProvider>
                        </SnackBarProvider>
                      </I18nProvider>
                    </SearchWrapper>
                  </FavoritesWrapper>
                </GeolocationWrapper>
              </ErrorBoundary>
            </AuthWrapper>
          </QueryClientProvider>
        </ThemeProvider>
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

import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { IdCheckContextProvider } from '@pass-culture/id-check'
import React, { FunctionComponent, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import 'react-native-gesture-handler' // @react-navigation
import 'react-native-get-random-values' // required for `uuid` module to work
import { AppState, AppStateStatus, LogBox } from 'react-native'
import { focusManager as reactQueryFocusManager, QueryClientProvider } from 'react-query'
import { addPlugin } from 'react-query-native-devtools'
import { ThemeProvider } from 'styled-components/native'

import './why-did-you-render'
import 'intl'
import 'intl/locale-data/jsonp/en'

import { api } from 'api/api'
import { AuthWrapper } from 'features/auth/AuthContext'
import { AsyncErrorBoundaryWithoutNavigation } from 'features/errors/pages/AsyncErrorBoundary'
import { FavoritesWrapper } from 'features/favorites/pages/FavoritesWrapper'
import { useBlockForMaintenance } from 'features/maintenance/useMaintenance'
import { AppNavigationContainer } from 'features/navigation/NavigationContainer'
import { SearchWrapper } from 'features/search/pages/SearchWrapper'
import { ABTestingProvider } from 'libs/ABTesting'
import { idCheckAnalytics } from 'libs/analytics'
import { campaignTracker } from 'libs/campaign'
import CodePushProvider from 'libs/codepush/CodePushProvider'
import { env } from 'libs/environment'
import { errorMonitoring } from 'libs/errorMonitoring'
import { GeolocationWrapper } from 'libs/geolocation'
import { activate } from 'libs/i18n'
import { idCheckRetentionClient } from 'libs/idCheckRetentionClient'
import { useStartBatchNotification } from 'libs/notifications'
import { queryClient } from 'libs/queryClient'
import { SafeAreaProvider } from 'libs/react-native-save-area-provider'
import { SplashScreenProvider } from 'libs/splashscreen'
import { theme } from 'theme'
import { SnackBarProvider } from 'ui/components/snackBar/SnackBarContext'

LogBox.ignoreLogs([
  'Setting a timer',
  'Expected style "elevation:',
  // TODO(antoinewg): remove once https://github.com/lingui/js-lingui/issues/1099 is resolved
  'Cannot update a component (`I18nProvider`) while rendering a different component',
])

if (__DEV__ && process.env.JEST !== 'true') {
  addPlugin({ queryClient })
}

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
  campaignTracker.useInit()
  useStartBatchNotification()

  useBlockForMaintenance()

  useEffect(() => {
    activate('fr')
  }, [])

  useEffect(() => {
    errorMonitoring.init({ enabled: !__DEV__ })
  }, [])

  return (
    <ABTestingProvider>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <AuthWrapper>
              <ErrorBoundary FallbackComponent={AsyncErrorBoundaryWithoutNavigation}>
                <GeolocationWrapper>
                  <FavoritesWrapper>
                    <SearchWrapper>
                      <I18nProvider i18n={i18n}>
                        <SnackBarProvider>
                          <IdCheckContextProvider
                            apiBaseUrl={env.ID_CHECK_API_URL}
                            supportEmail={env.SUPPORT_EMAIL_ADDRESS}
                            dsmUrl={env.DSM_URL}
                            personalDataDocUrl={env.DOC_PERSONAL_DATA_URL}
                            cguDocUrl={env.DOC_CGU_URL}
                            errorMonitoring={errorMonitoring}
                            analytics={idCheckAnalytics}
                            retentionClient={idCheckRetentionClient}
                            requestLicenceToken={() => api.getnativev1idCheckToken()}>
                            <SplashScreenProvider>
                              <AppNavigationContainer />
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
        </SafeAreaProvider>
      </ThemeProvider>
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

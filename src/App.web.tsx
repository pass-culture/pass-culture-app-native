// if __DEV__ import if you want to debug
// import './why-did-you-render'
import 'react-app-polyfill/ie9'
import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import globalThisShim from 'globalthis/shim'
import React, { Suspense, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { AuthWrapper } from 'features/auth/AuthContext'
import { CulturalSurveyContextProvider } from 'features/culturalSurvey/context/CulturalSurveyContextProvider'
import { AsyncErrorBoundaryWithoutNavigation } from 'features/errors/pages/AsyncErrorBoundary'
import { ScreenErrorProvider } from 'features/errors/pages/ScreenErrorProvider'
import { FavoritesWrapper } from 'features/favorites/pages/FavoritesWrapper'
import { IdentityCheckContextProvider } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { AppNavigationContainer } from 'features/navigation/NavigationContainer'
import { SearchWrapper } from 'features/search/pages/SearchWrapper'
import { initAlgoliaAnalytics } from 'libs/algolia/analytics/initAlgoliaAnalytics'
import { SearchAnalyticsWrapper } from 'libs/algolia/analytics/SearchAnalyticsWrapper'
import { AppWebHead } from 'libs/appWebHead'
import { env } from 'libs/environment'
import { GeolocationWrapper } from 'libs/geolocation'
import { activate } from 'libs/i18n'
import { eventMonitoring } from 'libs/monitoring'
import { SafeAreaProvider } from 'libs/react-native-save-area-provider'
import { ReactQueryClientProvider } from 'libs/react-query/ReactQueryClientProvider'
import { ThemeProvider } from 'libs/styled'
import { theme } from 'theme'
import { LoadingPage } from 'ui/components/LoadingPage'
import { SnackBarProvider } from 'ui/components/snackBar/SnackBarContext'
import { SupportedBrowsersGate } from 'web/SupportedBrowsersGate'
import { ServiceWorkerProvider } from 'web/useServiceWorker'
import 'resize-observer-polyfill/dist/ResizeObserver.global'

globalThisShim()

export function App() {
  useEffect(() => {
    activate('fr')
  }, [])

  useEffect(() => {
    eventMonitoring.init({ enabled: !__DEV__ })
  }, [])

  useEffect(() => {
    initAlgoliaAnalytics()
  }, [])

  return (
    <ServiceWorkerProvider fileName={`${env.PUBLIC_URL}/service-worker.js`}>
      <SupportedBrowsersGate>
        <ThemeProvider theme={theme}>
          <SafeAreaProvider>
            <ReactQueryClientProvider>
              <AuthWrapper>
                <ErrorBoundary FallbackComponent={AsyncErrorBoundaryWithoutNavigation}>
                  <GeolocationWrapper>
                    <FavoritesWrapper>
                      <SearchAnalyticsWrapper>
                        <SearchWrapper>
                          <I18nProvider i18n={i18n}>
                            <SnackBarProvider>
                              <CulturalSurveyContextProvider>
                                <IdentityCheckContextProvider>
                                  <AppWebHead />
                                  <ScreenErrorProvider>
                                    <Suspense fallback={<LoadingPage />}>
                                      <AppNavigationContainer />
                                    </Suspense>
                                  </ScreenErrorProvider>
                                </IdentityCheckContextProvider>
                              </CulturalSurveyContextProvider>
                            </SnackBarProvider>
                          </I18nProvider>
                        </SearchWrapper>
                      </SearchAnalyticsWrapper>
                    </FavoritesWrapper>
                  </GeolocationWrapper>
                </ErrorBoundary>
              </AuthWrapper>
            </ReactQueryClientProvider>
          </SafeAreaProvider>
        </ThemeProvider>
      </SupportedBrowsersGate>
    </ServiceWorkerProvider>
  )
}

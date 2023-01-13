// if __DEV__ import if you want to debug
// import './why-did-you-render'
import 'react-app-polyfill/ie9'
import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import globalThisShim from 'globalthis/shim'
import React, { Suspense, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { AuthWrapper } from 'features/auth/context/AuthContext'
import { SettingsWrapper } from 'features/auth/context/SettingsContext'
import { CulturalSurveyContextProvider } from 'features/culturalSurvey/context/CulturalSurveyContextProvider'
import { AsyncErrorBoundaryWithoutNavigation } from 'features/errors/pages/AsyncErrorBoundary'
import { ScreenErrorProvider } from 'features/errors/pages/ScreenErrorProvider'
import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { SubscriptionContextProvider } from 'features/identityCheck/context/SubscriptionContextProvider'
import { AppNavigationContainer } from 'features/navigation/NavigationContainer'
import { SearchWrapper } from 'features/search/context/SearchWrapper'
import { initAlgoliaAnalytics } from 'libs/algolia/analytics/initAlgoliaAnalytics'
import { SearchAnalyticsWrapper } from 'libs/algolia/analytics/SearchAnalyticsWrapper'
import { AppWebHead } from 'libs/appWebHead'
import { E2eContextProvider } from 'libs/e2e/E2eContextProvider'
import { env } from 'libs/environment'
import { RemoteConfigProvider } from 'libs/firebase/remoteConfig'
import { GeolocationWrapper } from 'libs/geolocation'
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
    eventMonitoring.init({ enabled: !__DEV__ })
  }, [])

  useEffect(() => {
    initAlgoliaAnalytics()
  }, [])

  return (
    <RemoteConfigProvider>
      <ServiceWorkerProvider fileName={`${env.PUBLIC_URL}/service-worker.js`}>
        <SupportedBrowsersGate>
          <ThemeProvider theme={theme}>
            <SafeAreaProvider>
              <ReactQueryClientProvider>
                <SettingsWrapper>
                  <AuthWrapper>
                    <ErrorBoundary FallbackComponent={AsyncErrorBoundaryWithoutNavigation}>
                      <E2eContextProvider>
                        <GeolocationWrapper>
                          <FavoritesWrapper>
                            <SearchAnalyticsWrapper>
                              <SearchWrapper>
                                <SnackBarProvider>
                                  <CulturalSurveyContextProvider>
                                    <SubscriptionContextProvider>
                                      <AppWebHead />
                                      <ScreenErrorProvider>
                                        <Suspense fallback={<LoadingPage />}>
                                          <AppNavigationContainer />
                                        </Suspense>
                                      </ScreenErrorProvider>
                                    </SubscriptionContextProvider>
                                  </CulturalSurveyContextProvider>
                                </SnackBarProvider>
                              </SearchWrapper>
                            </SearchAnalyticsWrapper>
                          </FavoritesWrapper>
                        </GeolocationWrapper>
                      </E2eContextProvider>
                    </ErrorBoundary>
                  </AuthWrapper>
                </SettingsWrapper>
              </ReactQueryClientProvider>
            </SafeAreaProvider>
          </ThemeProvider>
        </SupportedBrowsersGate>
      </ServiceWorkerProvider>
    </RemoteConfigProvider>
  )
}

// if __DEV__ import if you want to debug
// import './why-did-you-render'
import 'react-app-polyfill/ie9'
import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import globalThisShim from 'globalthis/shim'
import React, { Suspense, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { AccessibilityFiltersWrapper } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { AuthWrapper } from 'features/auth/context/AuthContext'
import { SettingsWrapper } from 'features/auth/context/SettingsContext'
import { CulturalSurveyContextProvider } from 'features/culturalSurvey/context/CulturalSurveyContextProvider'
import { AsyncErrorBoundaryWithoutNavigation } from 'features/errors/pages/AsyncErrorBoundary'
import { ScreenErrorProvider } from 'features/errors/pages/ScreenErrorProvider'
import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { SubscriptionContextProvider } from 'features/identityCheck/context/SubscriptionContextProvider'
import { AppNavigationContainer } from 'features/navigation/NavigationContainer'
import { SearchWrapper } from 'features/search/context/SearchWrapper'
import { OnboardingWrapper } from 'features/tutorial/context/OnboardingWrapper'
import { initAlgoliaAnalytics } from 'libs/algolia/analytics/initAlgoliaAnalytics'
import { SearchAnalyticsWrapper } from 'libs/algolia/analytics/SearchAnalyticsWrapper'
import { AppWebHead } from 'libs/appWebHead'
import { env } from 'libs/environment'
import { RemoteConfigProvider } from 'libs/firebase/remoteConfig'
import { LocationWrapper } from 'libs/location'
import { eventMonitoring } from 'libs/monitoring'
import { GoogleOAuthProvider } from 'libs/react-native-google-sso/GoogleOAuthProvider'
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
        <ReactQueryClientProvider>
          <ThemeProvider theme={theme}>
            <SupportedBrowsersGate>
              <SafeAreaProvider>
                <SettingsWrapper>
                  <GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID}>
                    <AuthWrapper>
                      <ErrorBoundary FallbackComponent={AsyncErrorBoundaryWithoutNavigation}>
                        <LocationWrapper>
                          <AccessibilityFiltersWrapper>
                            <FavoritesWrapper>
                              <SearchAnalyticsWrapper>
                                <SearchWrapper>
                                  <SnackBarProvider>
                                    <CulturalSurveyContextProvider>
                                      <SubscriptionContextProvider>
                                        <AppWebHead />
                                        <OnboardingWrapper>
                                          <ScreenErrorProvider>
                                            <Suspense fallback={<LoadingPage />}>
                                              <AppNavigationContainer />
                                            </Suspense>
                                          </ScreenErrorProvider>
                                        </OnboardingWrapper>
                                      </SubscriptionContextProvider>
                                    </CulturalSurveyContextProvider>
                                  </SnackBarProvider>
                                </SearchWrapper>
                              </SearchAnalyticsWrapper>
                            </FavoritesWrapper>
                          </AccessibilityFiltersWrapper>
                        </LocationWrapper>
                      </ErrorBoundary>
                    </AuthWrapper>
                  </GoogleOAuthProvider>
                </SettingsWrapper>
              </SafeAreaProvider>
            </SupportedBrowsersGate>
          </ThemeProvider>
        </ReactQueryClientProvider>
      </ServiceWorkerProvider>
    </RemoteConfigProvider>
  )
}

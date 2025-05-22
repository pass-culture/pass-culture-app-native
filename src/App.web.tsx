// if __DEV__ import if you want to debug
// import './why-did-you-render'
import globalThisShim from 'globalthis/shim'
import React, { Suspense, useEffect } from 'react'
import 'react-app-polyfill/stable'
import { ErrorBoundary } from 'react-error-boundary'

import { AccessibilityFiltersWrapper } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { AuthWrapper } from 'features/auth/context/AuthWrapper'
import { SettingsWrapper } from 'features/auth/context/SettingsContext'
import { CulturalSurveyContextProvider } from 'features/culturalSurvey/context/CulturalSurveyContextProvider'
import { AsyncErrorBoundaryWithoutNavigation } from 'features/errors/pages/AsyncErrorBoundaryWithoutNavigation'
import { ScreenErrorProvider } from 'features/errors/pages/ScreenErrorProvider'
import { FavoritesWrapper } from 'features/favorites/context/FavoritesWrapper'
import { SubscriptionContextProvider } from 'features/identityCheck/context/SubscriptionContextProvider'
import { AppNavigationContainer } from 'features/navigation/NavigationContainer'
import { SearchWrapper } from 'features/search/context/SearchWrapper'
import { initAlgoliaAnalytics } from 'libs/algolia/analytics/initAlgoliaAnalytics'
import { SearchAnalyticsWrapper } from 'libs/algolia/analytics/SearchAnalyticsWrapper'
import { AppWebHead } from 'libs/appWebHead'
import { env } from 'libs/environment/env'
import { LocationWrapper } from 'libs/location'
import { eventMonitoring } from 'libs/monitoring/services'
import { GoogleOAuthProvider } from 'libs/react-native-google-sso/GoogleOAuthProvider'
import { SafeAreaProvider } from 'libs/react-native-save-area-provider'
import { ReactQueryClientProvider } from 'libs/react-query/ReactQueryClientProvider'
import { ThemeProvider } from 'libs/styled'
import 'resize-observer-polyfill/dist/ResizeObserver.global'
import { ThemeWrapper } from 'libs/styled/ThemeWrapper'
import { theme } from 'theme'
import { SnackBarProvider } from 'ui/components/snackBar/SnackBarContext'
import { LoadingPage } from 'ui/pages/LoadingPage'
import { SupportedBrowsersGate } from 'web/SupportedBrowsersGate.web'
import 'reset-css'

globalThisShim()

export function App() {
  useEffect(() => {
    eventMonitoring.init({ enabled: !__DEV__ })
  }, [])

  useEffect(() => {
    initAlgoliaAnalytics()
  }, [])

  // Unregister service workers (to make sure all sw cache is removed)
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => registration.unregister())
      })
    }
  }, [])

  return (
    <ReactQueryClientProvider>
      <ThemeWrapper>
        {(colorScheme) => (
          <ThemeProvider theme={theme} colorScheme={colorScheme}>
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
                          </AccessibilityFiltersWrapper>
                        </LocationWrapper>
                      </ErrorBoundary>
                    </AuthWrapper>
                  </GoogleOAuthProvider>
                </SettingsWrapper>
              </SafeAreaProvider>
            </SupportedBrowsersGate>
          </ThemeProvider>
        )}
      </ThemeWrapper>
    </ReactQueryClientProvider>
  )
}

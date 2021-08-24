import 'react-app-polyfill/ie9'
import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import React, { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { QueryClientProvider } from 'react-query'
import { ThemeProvider } from 'styled-components/native'

import { AuthWrapper } from 'features/auth/AuthContext'
import { AsyncErrorBoundaryWithoutNavigation } from 'features/errors/pages/AsyncErrorBoundary'
import { FavoritesWrapper } from 'features/favorites/pages/FavoritesWrapper'
import { AppNavigationContainer } from 'features/navigation/NavigationContainer'
import { SearchWrapper } from 'features/search/pages/SearchWrapper'
import { AppWebHead } from 'libs/appWebHead'
import { GeolocationWrapper } from 'libs/geolocation'
import { activate } from 'libs/i18n'
import { IdCheckContextProvider } from 'libs/idCheck/IdCheckContextProvider'
import { errorMonitoring } from 'libs/monitoring'
import { useStartBatchNotification } from 'libs/notifications'
import { queryClient } from 'libs/queryClient'
import { SafeAreaProvider } from 'libs/react-native-save-area-provider'
import { theme } from 'theme'
import { SnackBarProvider } from 'ui/components/snackBar/SnackBarContext'

export function App() {
  useStartBatchNotification()

  useEffect(() => {
    activate('fr')
  }, [])

  useEffect(() => {
    errorMonitoring.init({ enabled: !__DEV__ })
  }, [])

  return (
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
                        <IdCheckContextProvider>
                          <AppWebHead />
                          <AppNavigationContainer />
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
  )
}

import 'react-app-polyfill/ie9'
import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { IdCheckContextProvider } from '@pass-culture/id-check'
import React, { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { QueryClientProvider } from 'react-query'
import { ThemeProvider } from 'styled-components/native'

import { api } from 'api/api'
import { AuthWrapper } from 'features/auth/AuthContext'
import { AsyncErrorBoundaryWithoutNavigation } from 'features/errors/pages/AsyncErrorBoundary'
import { FavoritesWrapper } from 'features/favorites/pages/FavoritesWrapper'
import { AppNavigationContainer } from 'features/navigation/NavigationContainer'
import { env } from 'libs/environment'
import { errorMonitoring } from 'libs/errorMonitoring'
import { activate } from 'libs/i18n'
import { idCheckAnalytics } from 'libs/idCheckAnalytics'
import { idCheckRetentionClient } from 'libs/idCheckRetentionClient'
import { queryClient } from 'libs/queryClient'
import { SafeAreaProvider } from 'libs/react-native-save-area-provider'
import { theme } from 'theme'
import { SnackBarProvider } from 'ui/components/snackBar/SnackBarContext'

export function App() {
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
              <FavoritesWrapper>
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
                      <AppNavigationContainer />
                    </IdCheckContextProvider>
                  </SnackBarProvider>
                </I18nProvider>
              </FavoritesWrapper>
            </ErrorBoundary>
          </AuthWrapper>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  )
}

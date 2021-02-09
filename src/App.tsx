import { I18nProvider } from '@lingui/react' //@translations
import React, { FunctionComponent } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import CodePush from 'react-native-code-push' // @codepush
import 'react-native-gesture-handler' // @react-navigation
import 'react-native-get-random-values' // required for `uuid` module to work
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query'
import { addPlugin } from 'react-query-native-devtools'

import './why-did-you-render'

import { AuthWrapper } from 'features/auth/AuthContext'
import { AsyncErrorBoundaryWithoutNavigation } from 'features/errors/pages/AsyncErrorBoundary'
import { RootNavigator } from 'features/navigation/RootNavigator'
import { SearchWrapper } from 'features/search/pages/SearchWrapper'
import { env } from 'libs/environment'
import { GeolocationWrapper } from 'libs/geolocation'
import { i18n } from 'libs/i18n' //@translations
import 'libs/sentry'
import { useStartBatchNotification } from 'libs/notifications'
import { SnackBarProvider } from 'ui/components/snackBar/SnackBarContext'

const codePushOptionsManual = {
  updateDialog: true,
  installMode: CodePush.InstallMode.IMMEDIATE,
  checkFrequency: CodePush.CheckFrequency.MANUAL,
}

const codePushOptionsAutoNextRestart = {
  installMode: CodePush.InstallMode.ON_NEXT_RESTART,
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
}

const codePushOptionsAutoImmediate = {
  installMode: CodePush.InstallMode.IMMEDIATE,
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
}

/* We want a different code push behaviour on prod and testing
  Testing: download updates as often as possible and restart the app immediately
  Prod: download update at start and install it at next restart
*/
const codePushOptionsAuto =
  env.ENV === 'testing' ? codePushOptionsAutoImmediate : codePushOptionsAutoNextRestart

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

const AppComponent: FunctionComponent = function () {
  useStartBatchNotification()

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary FallbackComponent={AsyncErrorBoundaryWithoutNavigation}>
          <GeolocationWrapper>
            <AuthWrapper>
              <SearchWrapper>
                <I18nProvider language={i18n.language} i18n={i18n}>
                  <SnackBarProvider>
                    <RootNavigator />
                  </SnackBarProvider>
                </I18nProvider>
              </SearchWrapper>
            </AuthWrapper>
          </GeolocationWrapper>
        </ErrorBoundary>
      </QueryClientProvider>
    </SafeAreaProvider>
  )
}

// @codepush
const App = env.FEATURE_FLAG_CODE_PUSH
  ? CodePush(env.FEATURE_FLAG_CODE_PUSH_MANUAL ? codePushOptionsManual : codePushOptionsAuto)(
      AppComponent
    )
  : AppComponent

export { App }

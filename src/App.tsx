import { I18nProvider } from '@lingui/react' //@translations
import React, { FunctionComponent } from 'react'
import CodePush from 'react-native-code-push' // @codepush
import 'react-native-gesture-handler' // @react-navigation
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query'
import { addPlugin } from 'react-query-native-devtools'

import './why-did-you-render'

import { AuthWrapper } from 'features/auth/AuthContext'
import { RootNavigator } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { useRequestGeolocPermission } from 'libs/geolocation'
import { i18n } from 'libs/i18n' //@translations
import 'libs/sentry'
import { useStartBatchNotification } from 'libs/notifications'
import { useHideSplashScreen } from 'libs/splashscreen'
import { SnackBarProvider } from 'ui/components/snackBar/SnackBarContext'

const codePushOptionsManual = {
  updateDialog: true,
  installMode: CodePush.InstallMode.IMMEDIATE,
  checkFrequency: CodePush.CheckFrequency.MANUAL,
}

const codePushOptionsAuto = {
  installMode: CodePush.InstallMode.ON_NEXT_RESTART,
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
}
const queryCache = new QueryCache()

if (__DEV__ && process.env.JEST !== 'true') {
  addPlugin(queryCache)
}
const queryClient = new QueryClient({
  cache: queryCache,
  defaultOptions: {
    queries: {
      useErrorBoundary: true,
    },
  },
})

const AppComponent: FunctionComponent = function () {
  useStartBatchNotification()
  useRequestGeolocPermission()
  useHideSplashScreen()

  return (
    <QueryClientProvider client={queryClient}>
      <AuthWrapper>
        <I18nProvider language={i18n.language} i18n={i18n}>
          <SafeAreaProvider>
            <SnackBarProvider>
              <RootNavigator />
            </SnackBarProvider>
          </SafeAreaProvider>
        </I18nProvider>
      </AuthWrapper>
    </QueryClientProvider>
  )
}

// @codepush
const App = env.FEATURE_FLAG_CODE_PUSH
  ? CodePush(env.FEATURE_FLAG_CODE_PUSH_MANUAL ? codePushOptionsManual : codePushOptionsAuto)(
      AppComponent
    )
  : AppComponent

export { App }

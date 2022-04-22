import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import React, { FunctionComponent, useEffect } from 'react'
import 'react-native-gesture-handler'
import 'react-native-get-random-values'
import CodePush from 'react-native-code-push'

import 'intl'
import 'intl/locale-data/jsonp/en'

import { AppNavigationContainer } from 'features/navigation/NavigationContainer'
import { AutoImmediate, NextRestart } from 'libs/codepush/options'
import { env } from 'libs/environment'
import { activate } from 'libs/i18n'
import { eventMonitoring } from 'libs/monitoring'
import { SafeAreaProvider } from 'libs/react-native-save-area-provider'
import { SplashScreenProvider } from 'libs/splashscreen'
import { ThemeProvider } from 'libs/styled'
import { theme } from 'theme'
import { SnackBarProvider } from 'ui/components/snackBar/SnackBarContext'

const App: FunctionComponent = function () {
  useEffect(() => {
    activate('fr')
  }, [])

  useEffect(() => {
    eventMonitoring.init()
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <I18nProvider i18n={i18n}>
          <SnackBarProvider>
            <SplashScreenProvider>
              <AppNavigationContainer />
            </SplashScreenProvider>
          </SnackBarProvider>
        </I18nProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  )
}

const config = env.ENV !== 'production' ? AutoImmediate : NextRestart
const AppWithCodepush = __DEV__ ? App : CodePush(config)(App)

export { AppWithCodepush as App }

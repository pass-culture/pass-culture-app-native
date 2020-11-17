import { I18nProvider } from '@lingui/react' //@translations
import React, { FunctionComponent, useState } from 'react'
import CodePush from 'react-native-code-push' // @codepush
import 'react-native-gesture-handler' // @react-navigation
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryCache, ReactQueryCacheProvider } from 'react-query'
import { addPlugin } from 'react-query-native-devtools'

import { RootTabNavigator } from 'features/navigation/RootTabNavigator'
import { env } from 'libs/environment'
import { i18n } from 'libs/i18n' //@translations
import 'libs/sentry'
import { useStartBatchNotification } from 'libs/notifications'
import { useHideSplashScreen } from 'libs/splashscreen'
import { SnackBar } from 'ui/components/snackBar/SnackBar'
import { Check } from 'ui/svg/icons/Check'
import { ColorsEnum } from 'ui/theme'

const codePushOptionsManual = {
  updateDialog: true,
  installMode: CodePush.InstallMode.IMMEDIATE,
  checkFrequency: CodePush.CheckFrequency.MANUAL,
}

const codePushOptionsAuto = {
  installMode: CodePush.InstallMode.ON_NEXT_RESTART,
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
}

const queryCache = new QueryCache({
  defaultConfig: {
    queries: {
      useErrorBoundary: true,
    },
  },
})

if (__DEV__ && process.env.JEST !== 'true') {
  addPlugin(queryCache)
}

const AppComponent: FunctionComponent = function () {
  useStartBatchNotification()
  useHideSplashScreen()

  const [isToasterVisible, setToasterVisible] = useState(true)

  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <I18nProvider language={i18n.language} i18n={i18n}>
        <SafeAreaProvider>
          <React.Fragment>
            <SnackBar
              visible={isToasterVisible}
              message={'Ton mot de passe a été modifié !'}
              icon={Check}
              onClose={() => {
                setToasterVisible(false)
                setTimeout(() => {
                  setToasterVisible(true)
                }, 10000)
              }}
              timeout={3000}
              backgroundColor={ColorsEnum.GREEN_VALID}
              color={ColorsEnum.WHITE}
              animationDuration={1000}
            />
            <RootTabNavigator />
          </React.Fragment>
        </SafeAreaProvider>
      </I18nProvider>
    </ReactQueryCacheProvider>
  )
}

// @codepush
const App = env.FEATURE_FLAG_CODE_PUSH
  ? CodePush(env.FEATURE_FLAG_CODE_PUSH_MANUAL ? codePushOptionsManual : codePushOptionsAuto)(
      AppComponent
    )
  : AppComponent

export { App }

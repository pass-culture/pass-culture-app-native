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
              message={'my message'}
              backgroundColor={'green'}
              color={'white'}
              animationDuration={1000}
              onClose={() => setToasterVisible(false)}
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

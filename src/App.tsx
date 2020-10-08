import { I18nProvider } from '@lingui/react' //@translations
import React, { FunctionComponent } from 'react'
import CodePush from 'react-native-code-push' // @codepush
import 'react-native-gesture-handler' // @react-navigation

import { RootNavigator } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { i18n } from 'libs/i18n' //@translations
import './libs/sentry'

const codePushOptionsManual = {
  updateDialog: true,
  installMode: CodePush.InstallMode.IMMEDIATE,
  checkFrequency: CodePush.CheckFrequency.MANUAL,
}

const codePushOptionsAuto = {
  installMode: CodePush.InstallMode.ON_NEXT_RESTART,
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
}

const AppComponent: FunctionComponent = function () {
  return (
    <I18nProvider language={i18n.language} i18n={i18n}>
      <RootNavigator />
    </I18nProvider>
  )
}

// @codepush
const App = env.FEATURE_FLAG_CODE_PUSH
  ? CodePush(env.FEATURE_FLAG_CODE_PUSH_MANUAL ? codePushOptionsManual : codePushOptionsAuto)(
      AppComponent
    )
  : AppComponent

export { App }

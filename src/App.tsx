import React, { FunctionComponent } from 'react';
import CodePush from 'react-native-code-push'; // @codepush
import { RootNavigator } from './navigation';
import { withRedux } from './hoc/withRedux'; // @redux
import { env } from './environment';
import 'react-native-gesture-handler'; // @react-navigation
import { useApolloClient } from './lib/apollo'; // @graphql
import { ApolloProvider } from '@apollo/react-hooks'; // @graphql
import { I18nProvider } from '@lingui/react'; //@translations
import { i18n } from './lib/i18n'; //@translations

const codePushOptionsManual = {
  updateDialog: true,
  installMode: CodePush.InstallMode.IMMEDIATE,
  checkFrequency: CodePush.CheckFrequency.MANUAL,
};

const codePushOptionsAuto = {
  installMode: CodePush.InstallMode.ON_NEXT_RESTART,
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
};

const AppContainer = withRedux(RootNavigator);

let App = undefined;

const AppComponent: FunctionComponent = () => {
  const apolloClient = useApolloClient(); // @graphql
  if (!apolloClient) return null; // @graphql

  return (
    <I18nProvider language={i18n.language} i18n={i18n}>
      {/* @ts-ignore Out of sync typings */}
      <ApolloProvider client={apolloClient}>
        <AppContainer />
      </ApolloProvider>
    </I18nProvider>
  );
};

// @codepush
App = env.FEATURE_FLAG_CODE_PUSH
  ? CodePush(env.FEATURE_FLAG_CODE_PUSH_MANUAL ? codePushOptionsManual : codePushOptionsAuto)(
      AppComponent
    )
  : AppComponent;

export { App };

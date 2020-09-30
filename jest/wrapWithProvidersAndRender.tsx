/* eslint-disable @typescript-eslint/no-explicit-any */
import { MockedProvider as MockedApolloProvider, MockedResponse } from '@apollo/react-testing';
import { I18nProvider } from '@lingui/react';
import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';
import { i18n } from '../src/lib/i18n';
import { Provider as ReduxProvider } from 'react-redux';
import { Store, createStore } from 'redux';
import { rootReducer, RootState } from '../src/redux/rootReducer';

interface WrapWithProvidersAndRenderParams {
  Component: React.FunctionComponent<any>;
  props?: Record<string, any>;
  testInitialReduxState?: Partial<RootState>;
  apolloMocks?: MockedResponse[];
}

export const wrapWithProvidersAndRender = ({
  Component,
  props = {},
  apolloMocks = [],
  testInitialReduxState,
}: WrapWithProvidersAndRenderParams): { component: RenderAPI; store: Store } => {
  // @ts-ignore
  const store = createStore(rootReducer, testInitialReduxState);

  const WrappedComponent = (
    <I18nProvider language={i18n.language} i18n={i18n}>
      <ReduxProvider store={store}>
        <MockedApolloProvider mocks={apolloMocks} addTypename={false}>
          <Component {...props} />
        </MockedApolloProvider>
      </ReduxProvider>
    </I18nProvider>
  );

  return { component: render(WrappedComponent), store };
};

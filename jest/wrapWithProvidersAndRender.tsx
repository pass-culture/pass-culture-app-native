/* eslint-disable @typescript-eslint/no-explicit-any */
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
}

export const wrapWithProvidersAndRender = ({
  Component,
  props = {},
  testInitialReduxState,
}: WrapWithProvidersAndRenderParams): { component: RenderAPI; store: Store } => {
  // @ts-ignore
  const store = createStore(rootReducer, testInitialReduxState);

  const WrappedComponent = (
    <I18nProvider language={i18n.language} i18n={i18n}>
      <ReduxProvider store={store}>
        <Component {...props} />
      </ReduxProvider>
    </I18nProvider>
  );

  return { component: render(WrappedComponent), store };
};

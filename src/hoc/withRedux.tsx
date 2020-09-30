import React, { PureComponent, ComponentType } from 'react';
import { Provider } from 'react-redux'; // @redux
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../redux/store'; // @redux

export const withRedux = (Component: ComponentType): ComponentType => {
  class ReduxHOC extends PureComponent {
    public render(): JSX.Element {
      return (
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Component />
          </PersistGate>
        </Provider>
      );
    }
  }

  return ReduxHOC;
};

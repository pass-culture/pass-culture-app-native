import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';
import configureStore from 'redux-mock-store'; // @redux
import { Provider } from 'react-redux'; // @redux
import { startLoading, finishLoading } from '../../../redux/LoadingStatus'; // @redux
import { Login } from '../Login.component';

const mockStore = configureStore([]);
const initialState = { loadingStatus: {}, authentication: {} };

describe('Login component', () => {
  const navigation = {
    navigate: jest.fn(),
  } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  const route = {
    params: { userId: 'testId' },
  } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

  it('should render correctly', () => {
    const store = mockStore(initialState);
    const login = render(
      <Provider store={store}>
        <Login navigation={navigation} route={route} />
      </Provider>
    );
    expect(login).toMatchSnapshot();
  });

  it('should have a button to go to the Home page', () => {
    const store = mockStore(initialState);
    const login = render(
      <Provider store={store}>
        <Login navigation={navigation} route={route} />
      </Provider>
    );

    const HomeButton = login.getByTestId('homepageButton');
    fireEvent.press(HomeButton);
    expect(navigation.navigate).toHaveBeenCalledWith('Home');
  });

  it('should trigger the loader', () => {
    const store = mockStore(initialState);
    const login = render(
      <Provider store={store}>
        <Login navigation={navigation} route={route} />
      </Provider>
    );

    expect(() => login.getByTestId('demoLoader')).toThrowError();

    const LoaderButton = login.getByTestId('loaderButton');
    fireEvent.press(LoaderButton);

    expect(store.getActions()).toEqual([startLoading('demoLoader')]);
  });

  it('should stop the loader', () => {
    const store = mockStore({
      ...initialState,
      loadingStatus: { demoLoader: { isLoading: true } },
    });
    const login = render(
      <Provider store={store}>
        <Login navigation={navigation} route={route} />
      </Provider>
    );

    expect(login.getByTestId('demoLoader')).toBeDefined();

    const LoaderButton = login.getByTestId('loaderButton');
    fireEvent.press(LoaderButton);

    expect(store.getActions()).toEqual([finishLoading('demoLoader')]);
  });
});

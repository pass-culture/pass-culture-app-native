import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';
import { Login } from './Login';

describe('Login component', () => {
  const navigation = {
    navigate: jest.fn(),
  } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  const route = {
    params: { userId: 'testId' },
  } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

  it('should have a button to go to the Home page', () => {
    const login = render(<Login navigation={navigation} route={route} />);
    const HomeButton = login.getByTestId('homepageButton');
    fireEvent.press(HomeButton);
    expect(navigation.navigate).toHaveBeenCalledWith('Home');
  });
});

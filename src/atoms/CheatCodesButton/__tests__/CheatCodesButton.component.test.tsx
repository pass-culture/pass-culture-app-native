import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';
import { CheatCodesButton } from '../CheatCodesButton.component';

describe('CheatCodesButton component', () => {
  const navigation = {
    navigate: jest.fn(),
  } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

  it('should have a button to go to the Login', () => {
    const component = render(<CheatCodesButton navigation={navigation} />);

    const Button = component.getByText('CheatCodes');
    fireEvent.press(Button);

    expect(navigation.navigate).toHaveBeenCalledWith('CheatCodes');
  });
});

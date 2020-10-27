import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { navigate } from '../../../../../__mocks__/@react-navigation/native'

import { NavigateHomeButton } from './NavigateHomeButton'

describe('NavigateHomeButton', () => {
  it('calls navigate to Home when pressed', () => {
    const { getByText } = render(<NavigateHomeButton />)
    fireEvent.press(getByText('Navigate to Home'))
    expect(navigate).toHaveBeenCalledWith('Home')
  })
})

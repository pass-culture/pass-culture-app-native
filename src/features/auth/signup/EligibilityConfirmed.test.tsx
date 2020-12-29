import { render, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'

import { EligibilityConfirmed } from './EligibilityConfirmed'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('<EligibilityConfirmed />', () => {
  it('should redirect to home page WHEN go back to home button is clicked', async () => {
    const { findByText } = render(<EligibilityConfirmed />)

    const button = await findByText('On y va !')
    fireEvent.press(button)

    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('Home', {
      shouldDisplayLoginModal: false,
    })
  })
})

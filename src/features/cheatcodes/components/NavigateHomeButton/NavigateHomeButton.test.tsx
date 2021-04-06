import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { fireEvent, render } from 'tests/utils'

import { NavigateHomeButton } from './NavigateHomeButton'

describe('NavigateHomeButton', () => {
  it('calls navigate to Home when pressed', () => {
    const { getByText } = render(<NavigateHomeButton />)
    fireEvent.press(getByText("Naviguer vers la page d'accueil"))
    expect(navigate).toHaveBeenCalledWith('Home', { shouldDisplayLoginModal: false })
  })
})

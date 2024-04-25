import React from 'react'

import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { fireEvent, render, screen } from 'tests/utils'

import { NavigateHomeButton } from './NavigateHomeButton'

jest.mock('features/navigation/helpers/navigateToHome')

describe('NavigateHomeButton', () => {
  it('calls navigate to Home when pressed', () => {
    render(<NavigateHomeButton />)
    fireEvent.press(screen.getByText('Naviguer vers la page d’accueil'))

    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })
})

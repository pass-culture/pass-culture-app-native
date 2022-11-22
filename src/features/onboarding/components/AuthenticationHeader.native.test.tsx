import React from 'react'

import { navigateToHome } from 'features/navigation/helpers'
import { AuthenticationHeader } from 'features/onboarding/components/AuthenticationHeader'
import { fireEvent, render } from 'tests/utils'

jest.mock('features/navigation/helpers')

describe('<AuthenticationHeader />', () => {
  it('should go to the home page when clicking on goBack button', async () => {
    const { getByLabelText } = render(<AuthenticationHeader />)

    const goBackButton = getByLabelText('Revenir en arrière')
    fireEvent.press(goBackButton)

    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })

  it('should go to the signup page when clicking on close button', async () => {
    const { getByLabelText } = render(<AuthenticationHeader />)

    const closeButton = getByLabelText('Fermer la page')
    fireEvent.press(closeButton)

    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })
})

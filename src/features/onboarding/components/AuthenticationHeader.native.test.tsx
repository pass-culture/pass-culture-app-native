import React from 'react'

import { navigateToHome } from 'features/navigation/helpers'
import { AuthenticationHeader } from 'features/onboarding/components/AuthenticationHeader'
import { fireEvent, render } from 'tests/utils'

jest.mock('features/navigation/helpers')

describe('<AuthenticationHeader />', () => {
  it('should go to the signup page when clicking on close button', async () => {
    const { getByLabelText } = render(<AuthenticationHeader />)

    const closeButton = getByLabelText('Fermer la page')
    fireEvent.press(closeButton)

    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })
})

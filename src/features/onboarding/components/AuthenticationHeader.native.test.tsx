import React from 'react'

import { reset } from '__mocks__/@react-navigation/native'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { AuthenticationHeader } from 'features/onboarding/components/AuthenticationHeader'
import { fireEvent, render } from 'tests/utils'

describe('<AuthenticationHeader />', () => {
  it('should go to the home page when clicking on goBack button', async () => {
    const { getByLabelText } = render(<AuthenticationHeader />)

    const goBackButton = getByLabelText('Revenir en arrière')
    fireEvent.press(goBackButton)

    expect(reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: homeNavConfig[0] }] })
  })

  it('should go to the signup page when clicking on close button', async () => {
    const { getByLabelText } = render(<AuthenticationHeader />)

    const closeButton = getByLabelText('Fermer la page')
    fireEvent.press(closeButton)

    expect(reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: homeNavConfig[0] }] })
  })
})

import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { DeeplinkImporter } from 'features/deeplinks/pages/DeeplinkImporter'
import { fireEvent, render } from 'tests/utils'

describe('DeeplinkImporter', () => {
  it('should navigate to the home', () => {
    const { getByTestId } = render(<DeeplinkImporter />)

    const goToOffersButton = getByTestId('button-container-to-offers')
    fireEvent.press(goToOffersButton)

    expect(navigate).toBeCalledWith('Home')
  })
})

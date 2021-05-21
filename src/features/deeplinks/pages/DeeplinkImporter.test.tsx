import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { DeeplinkImporter } from 'features/deeplinks/pages/DeeplinkImporter'
import { FIREBASE_DYNAMIC_LINK_DOMAIN } from 'features/deeplinks/utils'
import * as DeeplinkUtils from 'features/deeplinks/utils'
import { render, fireEvent } from 'tests/utils'

jest.mock('react-query')

describe('DeeplinkImporter', () => {
  it('should navigate to the home', () => {
    const { getByTestId } = render(<DeeplinkImporter />)

    const goToOffersButton = getByTestId('button-container-to-offers')
    fireEvent.press(goToOffersButton)

    expect(navigate).toBeCalledWith('Home')
  })
  it('should resolve the link', async () => {
    const url = FIREBASE_DYNAMIC_LINK_DOMAIN + 'home'

    const resolveHandlerSpy = jest.spyOn(DeeplinkUtils, 'resolveHandler')

    const { getByTestId, getByPlaceholderText } = render(<DeeplinkImporter />)

    const urlInput = getByPlaceholderText('Colle ton lien ici ...')
    const importButton = getByTestId('button-container-import')

    fireEvent.changeText(urlInput, url)
    fireEvent.press(importButton)

    await waitForExpect(() => {
      expect(resolveHandlerSpy).toBeCalled()
    })
    resolveHandlerSpy.mockRestore()
  })
})

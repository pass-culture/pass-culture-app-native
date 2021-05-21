import Clipboard from '@react-native-clipboard/clipboard'
import React from 'react'

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
  it('should resolve the link', () => {
    const url = FIREBASE_DYNAMIC_LINK_DOMAIN + '/home'
    Clipboard.setString(url)

    const resolveHandlerSpy = jest.spyOn(DeeplinkUtils, 'resolveHandler')

    const { getByTestId } = render(<DeeplinkImporter />)

    const importButton = getByTestId('button-container-import')
    fireEvent.press(importButton)

    resolveHandlerSpy.mockRestore()
  })
})

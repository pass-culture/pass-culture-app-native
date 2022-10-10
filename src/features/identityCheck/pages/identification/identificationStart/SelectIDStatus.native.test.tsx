import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SelectIDStatus } from 'features/identityCheck/pages/identification/identificationStart/SelectIDStatus'
import { fireEvent, render } from 'tests/utils'

describe('SelectIDStatus', () => {
  it('should render SelectIDStatus page correctly', () => {
    const renderAPI = render(<SelectIDStatus />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should navigate to ubble webview when pressing "J’ai ma pièce d’identité" button', () => {
    const { getByText } = render(<SelectIDStatus />)

    const button = getByText('J’ai ma pièce d’identité')
    fireEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('UbbleWebview', undefined)
  })

  it('should navigate to ComeBackLater when pressing "Je n’ai pas ma pièce d’identité originale" button', () => {
    const { getByText } = render(<SelectIDStatus />)

    const button = getByText('Je n’ai pas')
    fireEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('ComeBackLater', undefined)
  })
})

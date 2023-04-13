import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { IdentificationForkUbble } from 'features/identityCheck/pages/identification/IdentificationForkUbble'
import { fireEvent, render, waitFor } from 'tests/utils'

describe('<IdentificationForkUbble />', () => {
  it('should render correctly', () => {
    const renderForkUbble = render(<IdentificationForkUbble />)
    expect(renderForkUbble).toMatchSnapshot()
  })

  it('should navigate to next screen "SelectIDOrigin" on press "Ma pièce d’identité"', async () => {
    const { getByText } = render(<IdentificationForkUbble />)
    const button = getByText('Ma pièce d’identité')

    fireEvent.press(button)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('SelectIDOrigin', undefined)
    })
  })

  it('should navigate to next screen "IdentityCheckEduConnect" on press "Mes codes ÉduConnect"', async () => {
    const { getByText } = render(<IdentificationForkUbble />)
    const button = getByText('Mes codes ÉduConnect')

    fireEvent.press(button)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('IdentityCheckEduConnect', undefined)
    })
  })
})

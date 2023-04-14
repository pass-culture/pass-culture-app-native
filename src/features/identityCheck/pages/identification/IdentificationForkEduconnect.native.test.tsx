import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { IdentificationForkEduconnect } from 'features/identityCheck/pages/identification/IdentificationForkEduconnect'
import { fireEvent, render, waitFor } from 'tests/utils'

describe('<IdentificationForkEduconnect />', () => {
  it('should render correctly', () => {
    const renderForkUbble = render(<IdentificationForkEduconnect />)
    expect(renderForkUbble).toMatchSnapshot()
  })

  it('should navigate to next screen "SelectIDOrigin" on press "Ma pièce d’identité"', async () => {
    const { getByText } = render(<IdentificationForkEduconnect />)
    const button = getByText('Ma pièce d’identité')

    fireEvent.press(button)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('SelectIDOrigin', undefined)
    })
  })

  it('should navigate to next screen "IdentityCheckEduConnect" on press "Mes codes ÉduConnect"', async () => {
    const { getByText } = render(<IdentificationForkEduconnect />)
    const button = getByText('Mes codes ÉduConnect')

    fireEvent.press(button)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('IdentityCheckEduConnect', undefined)
    })
  })
})

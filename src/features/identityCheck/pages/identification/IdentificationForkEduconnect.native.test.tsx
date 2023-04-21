import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { IdentityCheckMethod } from 'api/gen'
import { IdentificationForkEduconnect } from 'features/identityCheck/pages/identification/IdentificationForkEduconnect'
import { amplitude } from 'libs/amplitude'
import { fireEvent, render, waitFor, screen } from 'tests/utils'

describe('<IdentificationForkEduconnect />', () => {
  it('should render correctly', () => {
    render(<IdentificationForkEduconnect />)
    expect(screen).toMatchSnapshot()
  })

  it('should navigate to next screen "SelectIDOrigin" on press "Ma pièce d’identité"', async () => {
    render(<IdentificationForkEduconnect />)
    const button = screen.getByText('Ma pièce d’identité')

    fireEvent.press(button)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('SelectIDOrigin', undefined)
    })
  })

  it('should navigate to next screen "IdentityCheckEduConnect" on press "Mes codes ÉduConnect"', async () => {
    render(<IdentificationForkEduconnect />)
    const button = screen.getByText('Mes codes ÉduConnect')

    fireEvent.press(button)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('IdentityCheckEduConnect', undefined)
    })
  })

  it('should send a amplitude event when the screen is mounted', async () => {
    render(<IdentificationForkEduconnect />)

    await waitFor(() =>
      expect(amplitude.logEvent).toHaveBeenCalledWith('screen_view_fork_educonnect')
    )
  })

  it('should send a amplitude event choose_method_ubble with fork_origin on press "Ma pièce d’identité"', async () => {
    render(<IdentificationForkEduconnect />)
    const button = screen.getByText('Ma pièce d’identité')

    fireEvent.press(button)

    await waitFor(() => {
      expect(amplitude.logEvent).toHaveBeenCalledWith('choose_method_ubble', {
        fork_origin: IdentityCheckMethod.educonnect,
      })
    })
  })

  it('should send a amplitude event choose_method_ubble with fork_origin on press "Mes codes ÉduConnect"', async () => {
    render(<IdentificationForkEduconnect />)
    const button = screen.getByText('Mes codes ÉduConnect')

    fireEvent.press(button)

    await waitFor(() => {
      expect(amplitude.logEvent).toHaveBeenCalledWith('choose_method_educonnect', {
        fork_origin: IdentityCheckMethod.educonnect,
      })
    })
  })
})

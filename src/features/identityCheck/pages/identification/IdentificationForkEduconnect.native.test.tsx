import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { IdentityCheckMethod } from 'api/gen'
import { IdentificationForkEduconnect } from 'features/identityCheck/pages/identification/IdentificationForkEduconnect'
import { analytics } from 'libs/analytics'
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

  it('should log screen view when the screen is mounted', async () => {
    render(<IdentificationForkEduconnect />)

    await waitFor(() => expect(analytics.logScreenViewForkEduconnect).toHaveBeenCalledTimes(1))
  })

  it('should log analytics with fork origin on press "Ma pièce d’identité"', async () => {
    render(<IdentificationForkEduconnect />)
    const button = screen.getByText('Ma pièce d’identité')

    fireEvent.press(button)

    await waitFor(() => {
      expect(analytics.logChooseUbbleMethod).toHaveBeenCalledWith(IdentityCheckMethod.educonnect)
    })
  })

  it('should log analytics with fork origin on press "Mes codes ÉduConnect"', async () => {
    render(<IdentificationForkEduconnect />)
    const button = screen.getByText('Mes codes ÉduConnect')

    fireEvent.press(button)

    await waitFor(() => {
      expect(analytics.logChooseEduConnectMethod).toHaveBeenCalledWith(
        IdentityCheckMethod.educonnect
      )
    })
  })
})

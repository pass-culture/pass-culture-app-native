import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { IdentityCheckMethod } from 'api/gen'
import { IdentificationForkUbble } from 'features/identityCheck/pages/identification/IdentificationForkUbble'
import { analytics } from 'libs/analytics'
import { fireEvent, render, waitFor, screen } from 'tests/utils'

describe('<IdentificationForkUbble />', () => {
  it('should render correctly', () => {
    render(<IdentificationForkUbble />)
    expect(screen).toMatchSnapshot()
  })

  it('should navigate to next screen "SelectIDOrigin" on press "Ma pièce d’identité"', async () => {
    render(<IdentificationForkUbble />)
    const button = screen.getByText('Ma pièce d’identité')

    fireEvent.press(button)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('SelectIDOrigin', undefined)
    })
  })

  it('should navigate to next screen "IdentityCheckEduConnect" on press "Mes codes ÉduConnect"', async () => {
    render(<IdentificationForkUbble />)
    const button = screen.getByText('Mes codes ÉduConnect')

    fireEvent.press(button)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('IdentityCheckEduConnect', undefined)
    })
  })

  it('should log screen view when the screen is mounted', async () => {
    render(<IdentificationForkUbble />)

    await waitFor(() => expect(analytics.logScreenViewForkUbble).toHaveBeenCalledTimes(1))
  })

  it('should log analytics with fork origin on press "Ma pièce d’identité"', async () => {
    render(<IdentificationForkUbble />)
    const button = screen.getByText('Ma pièce d’identité')

    fireEvent.press(button)

    await waitFor(() => {
      expect(analytics.logChooseUbbleMethod).toHaveBeenCalledWith(IdentityCheckMethod.ubble)
    })
  })

  it('should log analytics with fork origin on press "Mes codes ÉduConnect"', async () => {
    render(<IdentificationForkUbble />)
    const button = screen.getByText('Mes codes ÉduConnect')

    fireEvent.press(button)

    await waitFor(() => {
      expect(analytics.logChooseEduConnectMethod).toHaveBeenCalledWith(IdentityCheckMethod.ubble)
    })
  })
})

import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { IdentificationFork } from 'features/identityCheck/pages/identification/IdentificationFork'
import { analytics } from 'libs/analytics'
import { fireEvent, render, waitFor, screen } from 'tests/utils'

describe('<IdentificationFork />', () => {
  it('should render correctly', () => {
    render(<IdentificationFork />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to next screen "SelectIDOrigin" on press "Ma pièce d’identité"', async () => {
    render(<IdentificationFork />)
    const button = screen.getByText('Ma pièce d’identité')

    fireEvent.press(button)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('SelectIDOrigin', undefined)
    })
  })

  it('should navigate to next screen "EduConnectForm" on press "Mes codes ÉduConnect"', async () => {
    render(<IdentificationFork />)
    const button = screen.getByText('Mes codes ÉduConnect')

    fireEvent.press(button)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('EduConnectForm', undefined)
    })
  })

  it('should log screen view when the screen is mounted', async () => {
    render(<IdentificationFork />)

    await waitFor(() => expect(analytics.logScreenViewIdentityFork).toHaveBeenCalledTimes(1))
  })

  it('should log analytics on press "Ma pièce d’identité"', async () => {
    render(<IdentificationFork />)
    const button = screen.getByText('Ma pièce d’identité')

    fireEvent.press(button)

    await waitFor(() => {
      expect(analytics.logChooseUbbleMethod).toHaveBeenCalledTimes(1)
    })
  })

  it('should log analytics on press "Mes codes ÉduConnect"', async () => {
    render(<IdentificationFork />)
    const button = screen.getByText('Mes codes ÉduConnect')

    fireEvent.press(button)

    await waitFor(() => {
      expect(analytics.logChooseEduConnectMethod).toHaveBeenCalledTimes(1)
    })
  })
})

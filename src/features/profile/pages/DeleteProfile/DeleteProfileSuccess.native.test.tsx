import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { DeleteProfileSuccess } from './DeleteProfileSuccess'

jest.mock('features/navigation/helpers')
jest.mock('features/navigation/navigationRef')
jest.mock('features/auth/context/SettingsContext')

describe('DeleteProfileSuccess component', () => {
  it('should render delete profile success', () => {
    render(<DeleteProfileSuccess />)

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to Home page when clicking on "Retourner à l’accueil" button', () => {
    render(<DeleteProfileSuccess />)

    fireEvent.press(screen.getByText(`Retourner à l’accueil`))

    expect(navigateFromRef).toBeCalledWith(navigateToHomeConfig.screen, navigateToHomeConfig.params)
  })

  it('should log analytics and  redirect to Login page when clicking on "Réactiver mon compte" button', async () => {
    render(<DeleteProfileSuccess />)

    fireEvent.press(screen.getByText('Réactiver mon compte'))

    await waitFor(() => {
      expect(analytics.logAccountReactivation).toBeCalledWith('deleteprofilesuccess')
      expect(navigate).toBeCalledWith('Login', undefined)
    })
  })
})

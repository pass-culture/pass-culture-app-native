import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { NotConnectedFavorites } from './NotConnectedFavorites'

describe('NotConnectedFavorites component', () => {
  it('should render not connected favorites', () => {
    render(<NotConnectedFavorites />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to SignupForm on button click and log analytics', async () => {
    render(<NotConnectedFavorites />)

    fireEvent.press(screen.getByText(`Créer un compte`))

    await waitFor(() => {
      expect(navigate).toBeCalledWith('SignupForm', undefined)
      expect(analytics.logSignUpFromFavorite).toBeCalledTimes(1)
    })
  })

  it('should navigate to Login on button click log analytics', async () => {
    render(<NotConnectedFavorites />)

    fireEvent.press(screen.getByText(`Se connecter`))

    await waitFor(() => {
      expect(navigate).toBeCalledWith('Login', {})
      expect(analytics.logSignInFromFavorite).toBeCalledTimes(1)
    })
  })
})

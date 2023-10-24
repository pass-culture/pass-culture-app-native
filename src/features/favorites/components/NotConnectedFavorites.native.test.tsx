import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/analytics'
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
      expect(navigate).toHaveBeenCalledWith('SignupForm', undefined)
      expect(analytics.logSignUpFromFavorite).toHaveBeenCalledTimes(1)
      expect(analytics.logSignUpClicked).toHaveBeenNthCalledWith(1, { from: 'favorite' })
    })
  })

  it('should navigate to Login on button click log analytics', async () => {
    render(<NotConnectedFavorites />)

    fireEvent.press(screen.getByText(`Se connecter`))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('Login', {})
      expect(analytics.logSignInFromFavorite).toHaveBeenCalledTimes(1)
    })
  })
})

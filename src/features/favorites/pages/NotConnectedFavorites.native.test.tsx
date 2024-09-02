import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { NotConnectedFavorites } from './NotConnectedFavorites'

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('NotConnectedFavorites component', () => {
  it('should render not connected favorites', () => {
    render(<NotConnectedFavorites />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to SignupForm on button click and log analytics', async () => {
    render(<NotConnectedFavorites />)

    fireEvent.press(screen.getByText(`Créer un compte`))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('SignupForm', { from: StepperOrigin.FAVORITE })
      expect(analytics.logSignUpFromFavorite).toHaveBeenCalledTimes(1)
      expect(analytics.logSignUpClicked).toHaveBeenNthCalledWith(1, { from: 'favorite' })
    })
  })

  it('should navigate to Login on button click log analytics', async () => {
    render(<NotConnectedFavorites />)

    fireEvent.press(screen.getByText(`Se connecter`))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('Login', { from: StepperOrigin.FAVORITE })
      expect(analytics.logSignInFromFavorite).toHaveBeenCalledTimes(1)
    })
  })
})

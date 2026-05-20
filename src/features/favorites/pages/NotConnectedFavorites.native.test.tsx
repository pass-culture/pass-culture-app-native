import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { StepperOrigin } from 'features/navigation/navigators/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { render, screen, userEvent } from 'tests/utils'

import { NotConnectedFavorites } from './NotConnectedFavorites'

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('NotConnectedFavorites component', () => {
  it('should render not connected favorites', () => {
    render(<NotConnectedFavorites />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to SignupForm  when click on "Créer un compte"', async () => {
    render(<NotConnectedFavorites />)

    await user.press(screen.getByText(`Créer un compte`))

    expect(navigate).toHaveBeenCalledWith('SignupForm', { from: StepperOrigin.FAVORITE })
  })

  it('should log analytic "logSignUpFromFavorite" when click on "Créer un compte"', async () => {
    render(<NotConnectedFavorites />)

    await user.press(screen.getByText(`Créer un compte`))

    expect(analytics.logSignUpFromFavorite).toHaveBeenCalledTimes(1)
  })

  it('should log analytic "logSignUpClicked" when click on "Créer un compte"', async () => {
    render(<NotConnectedFavorites />)

    await user.press(screen.getByText(`Créer un compte`))

    expect(analytics.logSignUpClicked).toHaveBeenNthCalledWith(1, { from: 'favorite' })
  })

  it('should navigate to Login when click on "Se connecter"', async () => {
    render(<NotConnectedFavorites />)

    await user.press(screen.getByText(`Se connecter`))

    expect(navigate).toHaveBeenCalledWith('Login', { from: StepperOrigin.FAVORITE })
  })

  it('should log analytic "logSignInFromFavorite" when click on "Se connecter"', async () => {
    render(<NotConnectedFavorites />)

    await user.press(screen.getByText(`Se connecter`))

    expect(analytics.logSignInFromFavorite).toHaveBeenCalledTimes(1)
  })
})

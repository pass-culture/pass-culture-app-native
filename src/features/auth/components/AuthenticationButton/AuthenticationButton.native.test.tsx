import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { StepperOrigin } from 'features/navigation/navigators/RootNavigator/types'
import { render, screen, userEvent } from 'tests/utils'

const NAV_PARAMS_LOGIN = { offerId: 1 }
const NAV_PARAMS_SIGNUP = { offerId: 1, from: StepperOrigin.HOME }

const user = userEvent.setup()
jest.useFakeTimers()

describe('<AuthenticationButton />', () => {
  it('should navigate to the login page when is type login', async () => {
    render(<AuthenticationButton type="login" />)

    const connectButton = screen.getByText('Se connecter')
    await user.press(connectButton)

    expect(navigate).toHaveBeenCalledWith('Login', {})
  })

  it('should navigate to the signup page when is type signup', async () => {
    render(<AuthenticationButton type="signup" />)

    const connectButton = screen.getByText('Créer un compte')
    await user.press(connectButton)

    expect(navigate).toHaveBeenCalledWith('SignupForm', {})
  })

  it('should navigate with additional params when defined for login', async () => {
    render(<AuthenticationButton type="login" params={NAV_PARAMS_LOGIN} />)

    const connectButton = screen.getByText('Se connecter')
    await user.press(connectButton)

    expect(navigate).toHaveBeenCalledWith('Login', NAV_PARAMS_LOGIN)
  })

  it('should navigate with additional params when defined for signup', async () => {
    render(<AuthenticationButton type="signup" params={NAV_PARAMS_SIGNUP} />)

    const connectButton = screen.getByText('Créer un compte')
    await user.press(connectButton)

    expect(navigate).toHaveBeenCalledWith('SignupForm', NAV_PARAMS_SIGNUP)
  })
})

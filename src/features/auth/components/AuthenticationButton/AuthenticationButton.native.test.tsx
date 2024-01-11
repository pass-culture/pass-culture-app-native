import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { fireEvent, render, screen } from 'tests/utils'

const NAV_PARAMS_LOGIN = { offerId: 1, preventCancellation: true }
const NAV_PARAMS_SIGNUP = { offerId: 1, preventCancellation: true, from: StepperOrigin.HOME }

describe('<AuthenticationButton />', () => {
  it('should navigate to the login page when is type login', async () => {
    render(<AuthenticationButton type="login" />)

    const connectButton = screen.getByRole('link')
    fireEvent.press(connectButton)

    expect(navigate).toHaveBeenCalledWith('Login', {})
  })

  it('should navigate to the signup page when is type signup', async () => {
    render(<AuthenticationButton type="signup" />)

    const connectButton = screen.getByRole('link')
    fireEvent.press(connectButton)

    expect(navigate).toHaveBeenCalledWith('SignupForm', {})
  })

  it('should navigate with additional params when defined for login', () => {
    render(<AuthenticationButton type="login" params={NAV_PARAMS_LOGIN} />)

    const connectButton = screen.getByRole('link')
    fireEvent.press(connectButton)

    expect(navigate).toHaveBeenCalledWith('Login', NAV_PARAMS_LOGIN)
  })

  it('should navigate with additional params when defined for signup', () => {
    render(<AuthenticationButton type="signup" params={NAV_PARAMS_SIGNUP} />)

    const connectButton = screen.getByRole('link')
    fireEvent.press(connectButton)

    expect(navigate).toHaveBeenCalledWith('SignupForm', NAV_PARAMS_SIGNUP)
  })
})

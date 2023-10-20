import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { fireEvent, render, screen } from 'tests/utils'

const NAV_PARAMS = { offerId: 1, preventCancellation: true }

describe('<AuthenticationButton />', () => {
  it('should navigate to the login page when is type login', async () => {
    render(<AuthenticationButton type="login" />)

    const connectButton = screen.getByRole('link')
    await fireEvent.press(connectButton)

    expect(navigate).toBeCalledWith('Login', {})
  })

  it('should navigate to the signup page when is type signup', async () => {
    render(<AuthenticationButton type="signup" />)

    const connectButton = screen.getByRole('link')
    await fireEvent.press(connectButton)

    expect(navigate).toBeCalledWith('SignupForm', {})
  })

  it('should navigate with additionnal params when defined for login', () => {
    render(<AuthenticationButton type="login" params={NAV_PARAMS} />)

    const connectButton = screen.getByRole('link')
    fireEvent.press(connectButton)

    expect(navigate).toBeCalledWith('Login', { ...NAV_PARAMS })
  })

  it('should navigate with additionnal params when defined for signup', () => {
    render(<AuthenticationButton type="signup" params={NAV_PARAMS} />)

    const connectButton = screen.getByRole('link')
    fireEvent.press(connectButton)

    expect(navigate).toBeCalledWith('SignupForm', { ...NAV_PARAMS })
  })
})

import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { fireEvent, render } from 'tests/utils'

const NAV_PARAMS = { offerId: 1, preventCancellation: true }

describe('<AuthenticationButton />', () => {
  it('should navigate to the login page when is type login', async () => {
    const { getByRole } = render(<AuthenticationButton type="login" />)

    const connectButton = getByRole('link')
    await fireEvent.press(connectButton)

    expect(navigate).toBeCalledWith('Login', {})
  })

  it('should navigate to the signup page when is type signup', async () => {
    const { getByRole } = render(<AuthenticationButton type="signup" />)

    const connectButton = getByRole('link')
    await fireEvent.press(connectButton)

    expect(navigate).toBeCalledWith('SignupForm', {})
  })

  it('should navigate with additionnal params when defined for login', async () => {
    const { getByRole } = render(<AuthenticationButton type="login" params={NAV_PARAMS} />)

    const connectButton = getByRole('link')
    await fireEvent.press(connectButton)

    expect(navigate).toBeCalledWith('Login', { ...NAV_PARAMS })
  })

  it('should navigate with additionnal params when defined for signup', async () => {
    const { getByRole } = render(<AuthenticationButton type="signup" params={NAV_PARAMS} />)

    const connectButton = getByRole('link')
    await fireEvent.press(connectButton)

    expect(navigate).toBeCalledWith('SignupForm', { ...NAV_PARAMS })
  })
})

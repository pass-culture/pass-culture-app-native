import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { fireEvent, render } from 'tests/utils'

describe('<AuthenticationButton />', () => {
  it('should navigate to the login page when is type login', async () => {
    const { getByRole } = render(<AuthenticationButton type="login" />)

    const connectButton = getByRole('link')
    await fireEvent.press(connectButton)

    expect(navigate).toBeCalledWith('Login', { preventCancellation: true })
  })
  it('should navigate to the signup page when is type signup', async () => {
    const { getByRole } = render(<AuthenticationButton type="signup" />)

    const connectButton = getByRole('link')
    await fireEvent.press(connectButton)

    expect(navigate).toBeCalledWith('SignupForm', undefined)
  })
})

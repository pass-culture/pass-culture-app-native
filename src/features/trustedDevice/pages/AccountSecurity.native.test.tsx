import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { navigateToHome } from 'features/navigation/helpers'
import { ROUTE_PARAMS } from 'features/trustedDevice/fixtures/fixtures'
import { fireEvent, render, screen } from 'tests/utils'

import { AccountSecurity } from './AccountSecurity'

jest.unmock('jwt-decode')
jest.mock('features/navigation/helpers')

describe('<AccountSecurity/>', () => {
  it('should match snapshot when no token', () => {
    render(<AccountSecurity />)

    expect(screen).toMatchSnapshot()
  })

  it('should match snapshot with valid token', () => {
    useRoute.mockReturnValueOnce({ params: ROUTE_PARAMS })
    render(<AccountSecurity />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to reinitialize password when choosing this option', () => {
    useRoute.mockReturnValueOnce({ params: ROUTE_PARAMS })
    render(<AccountSecurity />)
    fireEvent.press(screen.getByText('Modifier mon mot de passe'))

    expect(navigate).toHaveBeenCalledWith('ReinitializePassword', {
      email: ROUTE_PARAMS.email,
      expiration_timestamp: ROUTE_PARAMS.expiration_timestamp,
      token: ROUTE_PARAMS.reset_password_token,
    })
  })

  it('should navigate to home password when choosing no security', () => {
    render(<AccountSecurity />)
    fireEvent.press(screen.getByText('Ne pas sécuriser mon compte'))

    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })

  it('should navigate to account suspension confirmation when choosing this option', () => {
    useRoute.mockReturnValueOnce({
      params: ROUTE_PARAMS,
    })
    render(<AccountSecurity />)
    fireEvent.press(screen.getByText('Suspendre mon compte'))

    expect(navigate).toHaveBeenCalledWith('SuspensionChoice', { token: ROUTE_PARAMS.token })
  })
})

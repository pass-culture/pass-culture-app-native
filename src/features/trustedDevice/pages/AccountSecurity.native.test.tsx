import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { navigateToHome } from 'features/navigation/helpers'
import { fireEvent, render, screen } from 'tests/utils'

import { AccountSecurity } from './AccountSecurity'

jest.unmock('jwt-decode')
jest.mock('features/navigation/helpers')

const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwibG9jYXRpb24iOiJQYXJpcyIsImRhdGVDcmVhdGVkIjoiMjAyMy0wNi0wOVQxMDowMDowMFoiLCJvcyI6ImlPUyIsInNvdXJjZSI6ImlQaG9uZSAxMyJ9.0x9m4wEh0QKefPSsCOJDVrA-xVRGnUcoJR_vEbjNtaE'

describe('<AccountSecurity/>', () => {
  it('should match snapshot when no token', () => {
    render(<AccountSecurity />)

    expect(screen).toMatchSnapshot()
  })

  it('should match snapshot with valid token', () => {
    useRoute.mockReturnValueOnce({ params: { token: TOKEN } })
    render(<AccountSecurity />)

    expect(screen).toMatchSnapshot()
  })

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should navigate to change password when choosing this option', () => {
    render(<AccountSecurity />)
    fireEvent.press(screen.getByText('Modifier mon mot de passe'))

    expect(navigate).toHaveBeenCalledWith('ChangePassword', undefined)
  })

  it('should navigate to home password when choosing no security', () => {
    render(<AccountSecurity />)
    fireEvent.press(screen.getByText('Ne pas sécuriser mon compte'))

    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })

  it('should navigate to account suspension confirmation when choosing this option', () => {
    render(<AccountSecurity />)
    fireEvent.press(screen.getByText('Suspendre mon compte'))

    expect(navigate).toHaveBeenCalledWith('SuspensionChoice', undefined)
  })
})

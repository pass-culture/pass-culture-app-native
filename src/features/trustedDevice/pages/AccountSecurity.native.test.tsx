import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { navigateToHome } from 'features/navigation/helpers'
import { fireEvent, render, screen } from 'tests/utils'

import { AccountSecurity } from './AccountSecurity'

jest.mock('react-query')
jest.mock('features/navigation/helpers')

const mockSignOut = jest.fn()
jest.mock('features/auth/helpers/useLogoutRoutine', () => ({
  useLogoutRoutine: jest.fn(() => mockSignOut.mockResolvedValueOnce(jest.fn())),
}))

describe('<AccountSecurity/>', () => {
  it('should match snapshot', () => {
    render(<AccountSecurity />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to change password when choosing this option', () => {
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

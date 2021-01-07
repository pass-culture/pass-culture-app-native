import { render, fireEvent } from '@testing-library/react-native'
import React from 'react'
import { act } from 'react-test-renderer'

import { LogoutButton } from 'features/auth/components/LogoutButton'
import { flushAllPromises } from 'tests/utils'

beforeEach(() => {
  jest.clearAllMocks()
})

const mockSignOut = jest.fn()
jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
  useLogoutRoutine: jest.fn(() => mockSignOut),
}))

describe('LogoutButton component', () => {
  it('should display if the user is connected', async () => {
    const component = render(<LogoutButton />)
    await act(async () => {
      await flushAllPromises()
    })
    expect(component.getByText('⚠️ Se déconnecter')).toBeTruthy()
  })

  it('deletes the refreshToken from Keychain when pressed', async () => {
    const component = render(<LogoutButton />)

    const Button = component.getByTestId('logoutButton')
    await act(async () => {
      fireEvent.press(Button)
      await flushAllPromises()
    })
    expect(mockSignOut).toHaveBeenCalled()
  })
})

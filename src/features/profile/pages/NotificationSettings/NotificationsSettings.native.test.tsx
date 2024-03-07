import React from 'react'

import { IAuthContext, useAuthContext } from 'features/auth/context/AuthContext'
import { beneficiaryUser } from 'fixtures/user'
import { render, screen } from 'tests/utils'

import { NotificationsSettings } from './NotificationsSettings'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

const baseAuthContext: IAuthContext = {
  isLoggedIn: true,
  user: beneficiaryUser,
  isUserLoading: false,
  refetchUser: jest.fn(),
  setIsLoggedIn: jest.fn(),
}

describe('NotificationSettings', () => {
  it('should render correctly when user is logged in', () => {
    mockUseAuthContext.mockReturnValueOnce(baseAuthContext)
    render(<NotificationsSettings />)

    expect(screen).toMatchSnapshot()
  })

  it('should render correctly when user is not logged in', () => {
    mockUseAuthContext.mockReturnValueOnce({
      ...baseAuthContext,
      user: undefined,
      isLoggedIn: false,
    })
    render(<NotificationsSettings />)

    expect(screen).toMatchSnapshot()
  })
})

import React from 'react'

import { beneficiaryUser } from 'fixtures/user'
import { render, screen } from 'tests/utils'

import { OfflinePage } from './OfflinePage'

const mockUseAuthContext = jest.fn().mockReturnValue({
  user: { ...beneficiaryUser },
  isLoggedIn: true,
})

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
}))

describe('<OfflinePage />', () => {
  it('should match snapshot with default message', () => {
    mockUseAuthContext.mockReturnValueOnce({ isLoggedIn: false, user: undefined })
    render(<OfflinePage />)

    expect(screen).toMatchSnapshot()
  })

  it('should match snapshot with button', () => {
    mockUseAuthContext.mockReturnValueOnce({ isLoggedIn: true, user: beneficiaryUser })
    render(<OfflinePage />)

    expect(screen).toMatchSnapshot()
  })
})

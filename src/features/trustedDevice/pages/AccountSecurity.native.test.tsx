import React from 'react'

import { render, screen } from 'tests/utils'

import { AccountSecurity } from './AccountSecurity'

jest.mock('react-query')

const mockSignOut = jest.fn()
jest.mock('features/auth/helpers/useLogoutRoutine', () => ({
  useLogoutRoutine: jest.fn(() => mockSignOut.mockResolvedValueOnce(jest.fn())),
}))

describe('<AccountSecurity/>', () => {
  it('should match snapshot', () => {
    render(<AccountSecurity />)

    expect(screen).toMatchSnapshot()
  })
})

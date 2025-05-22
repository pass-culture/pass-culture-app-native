import React from 'react'

import { render, screen } from 'tests/utils'

import { SiteMapScreen } from './SiteMapScreen'

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

describe('SiteMapScreen', () => {
  it('should render correctly', () => {
    render(<SiteMapScreen />)

    expect(screen).toMatchSnapshot()
  })
})

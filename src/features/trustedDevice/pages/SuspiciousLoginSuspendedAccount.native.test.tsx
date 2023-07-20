import React from 'react'

import { render, screen } from 'tests/utils'

import { SuspiciousLoginSuspendedAccount } from './SuspiciousLoginSuspendedAccount'

jest.mock('features/auth/helpers/useLogoutRoutine')

describe('<SuspiciousLoginSuspendedAccount/>', () => {
  it('should match snapshot', () => {
    render(<SuspiciousLoginSuspendedAccount />)

    expect(screen).toMatchSnapshot()
  })
})

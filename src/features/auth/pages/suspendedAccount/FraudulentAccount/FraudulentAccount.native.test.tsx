import React from 'react'

import { render, screen } from 'tests/utils'

import { FraudulentAccount } from './FraudulentAccount'

jest.mock('features/auth/helpers/useLogoutRoutine')

describe('<FraudulentAccount />', () => {
  it('should match snapshot', () => {
    render(<FraudulentAccount />)

    expect(screen).toMatchSnapshot()
  })
})

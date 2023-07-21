import React from 'react'

import { render, screen } from 'tests/utils'

import { SuspensionConfirmation } from './SuspensionConfirmation'

jest.mock('features/auth/helpers/useLogoutRoutine')

describe('<SuspensionConfirmation/>', () => {
  it('should match snapshot', () => {
    render(<SuspensionConfirmation />)

    expect(screen).toMatchSnapshot()
  })
})

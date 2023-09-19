import React from 'react'

import { analytics } from 'libs/analytics'
import { fireEvent, render, screen } from 'tests/utils'

import { SuspiciousLoginSuspendedAccount } from './SuspiciousLoginSuspendedAccount'

jest.mock('features/auth/helpers/useLogoutRoutine')

describe('<SuspiciousLoginSuspendedAccount/>', () => {
  it('should match snapshot', () => {
    render(<SuspiciousLoginSuspendedAccount />)

    expect(screen).toMatchSnapshot()
  })

  it('should log analytics when clicking on "Contacter le service fraude" button', () => {
    render(<SuspiciousLoginSuspendedAccount />)

    const contactSupportButton = screen.getByText('Contacter le service fraude')
    fireEvent.press(contactSupportButton)

    expect(analytics.logContactFraudTeam).toHaveBeenCalledWith({
      from: 'suspiciousloginsuspendedaccount',
    })
  })
})

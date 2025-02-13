import React from 'react'

import { analytics } from 'libs/analytics/provider'
import { fireEvent, render, screen } from 'tests/utils'

import { FraudulentSuspendedAccount } from './FraudulentSuspendedAccount'

jest.mock('features/auth/helpers/useLogoutRoutine')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<FraudulentSuspendedAccount />', () => {
  it('should match snapshot', () => {
    render(<FraudulentSuspendedAccount />)

    expect(screen).toMatchSnapshot()
  })

  it('should log analytics when clicking on "Contacter le service fraude" button', () => {
    render(<FraudulentSuspendedAccount />)

    const contactSupportButton = screen.getByText('Contacter le service fraude')
    fireEvent.press(contactSupportButton)

    expect(analytics.logContactFraudTeam).toHaveBeenCalledWith({
      from: 'fraudulentsuspendedaccount',
    })
  })
})

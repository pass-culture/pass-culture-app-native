import React from 'react'

import { analytics } from 'libs/analytics/provider'
import { render, screen, userEvent } from 'tests/utils'

import { SuspiciousLoginSuspendedAccount } from './SuspiciousLoginSuspendedAccount'

jest.mock('features/auth/helpers/useLogoutRoutine')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const mockDeviceMetrics = {
  resolution: '1080x1920',
  screenZoomLevel: undefined,
  fontScale: 1.5,
}

jest.mock('features/trustedDevice/helpers/useDeviceMetrics', () => ({
  useDeviceMetrics: () => mockDeviceMetrics,
}))

const user = userEvent.setup()
jest.useFakeTimers()

describe('<SuspiciousLoginSuspendedAccount/>', () => {
  it('should match snapshot', () => {
    render(<SuspiciousLoginSuspendedAccount />)

    expect(screen).toMatchSnapshot()
  })

  it('should log analytics when clicking on "Contacter le service fraude" button', async () => {
    render(<SuspiciousLoginSuspendedAccount />)

    const contactSupportButton = screen.getByText('Contacter le service fraude')
    await user.press(contactSupportButton)

    expect(analytics.logContactFraudTeam).toHaveBeenCalledWith({
      from: 'suspiciousloginsuspendedaccount',
    })
  })
})

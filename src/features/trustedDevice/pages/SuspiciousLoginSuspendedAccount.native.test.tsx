import React from 'react'

import { analytics } from 'libs/analytics'
import { fireEvent, render, screen } from 'tests/utils'

import { SuspiciousLoginSuspendedAccount } from './SuspiciousLoginSuspendedAccount'

jest.mock('features/auth/helpers/useLogoutRoutine')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

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

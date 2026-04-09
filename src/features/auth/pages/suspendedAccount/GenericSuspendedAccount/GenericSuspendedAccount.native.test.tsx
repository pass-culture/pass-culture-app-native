import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { GenericSuspendedAccount } from 'features/auth/pages/suspendedAccount/GenericSuspendedAccount/GenericSuspendedAccount'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { buildZendeskUrlForFraud } from 'features/profile/helpers/buildZendeskUrl'
import { beneficiaryUser } from 'fixtures/user'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { userEvent, render, screen } from 'tests/utils'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

const mockSignOut = jest.fn()
jest.mock('features/auth/helpers/useLogoutRoutine', () => ({
  useLogoutRoutine: jest.fn(() => mockSignOut.mockResolvedValueOnce(jest.fn())),
}))

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/firebase/analytics/analytics')

const mockDeviceInfo = {
  deviceId: 'device-id',
  os: 'iOS 17',
  source: 'iPhone 15',
  resolution: '1170x2532',
  fontScale: 1,
  screenZoomLevel: 1.25,
}

const mockVersion = '1.300.0'

jest.mock('features/trustedDevice/helpers/useDeviceInfo', () => ({
  useDeviceInfo: () => mockDeviceInfo,
}))

jest.mock('ui/hooks/useVersion', () => ({
  useVersion: () => mockVersion,
}))

const user = userEvent.setup()
jest.useFakeTimers()

describe('<GenericSuspendedAccount />', () => {
  beforeEach(() => {
    mockAuthContextWithUser(beneficiaryUser)
  })

  it('should open Zendesk url when clicking on "Contacter le service fraude" button', async () => {
    render(<GenericSuspendedAccount onBeforeNavigateContactFraudTeam={jest.fn()} />)

    const contactSupportButton = screen.getByText('Contacter le service fraude')
    await user.press(contactSupportButton)

    expect(openUrl).toHaveBeenCalledWith(
      buildZendeskUrlForFraud({
        user: beneficiaryUser,
        deviceInfo: mockDeviceInfo,
        version: mockVersion,
      }),
      undefined,
      true
    )
  })

  it('should go to home page when clicking on go to home button', async () => {
    render(<GenericSuspendedAccount onBeforeNavigateContactFraudTeam={jest.fn()} />)

    const homeButton = screen.getByText('Retourner à l’accueil')
    await user.press(homeButton)

    expect(navigate).toHaveBeenNthCalledWith(
      1,
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
    expect(mockSignOut).toHaveBeenCalledTimes(1)
  })
})

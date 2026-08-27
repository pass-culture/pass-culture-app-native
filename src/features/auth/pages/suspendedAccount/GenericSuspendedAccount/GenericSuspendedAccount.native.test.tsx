import React from 'react'

import { GenericSuspendedAccount } from 'features/auth/pages/suspendedAccount/GenericSuspendedAccount/GenericSuspendedAccount'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { resetFromRef } from 'features/navigation/navigationRef'
import { buildZendeskUrlForFraud } from 'features/profile/helpers/buildZendeskUrl'
import { beneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { userEvent, render, screen } from 'tests/utils'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

const mockSignOut = jest.fn()
jest.mock('features/auth/helpers/useLogoutRoutine', () => ({
  useLogoutRoutine: jest.fn(() => mockSignOut.mockResolvedValueOnce(jest.fn())),
}))

jest.mock('features/auth/context/AuthContext')
jest.mock('features/navigation/navigationRef')
jest.mock('libs/firebase/analytics/analytics')

const mockDeviceMetrics = {
  resolution: '1080x1920',
  screenZoomLevel: undefined,
  fontScale: 1.5,
}

jest.mock('features/trustedDevice/helpers/useDeviceMetrics', () => ({
  useDeviceMetrics: () => mockDeviceMetrics,
}))

const mockVersion = '1.300.0'

jest.mock('ui/hooks/useVersion', () => ({
  useVersion: () => mockVersion,
}))

const user = userEvent.setup()
jest.useFakeTimers()

describe('<GenericSuspendedAccount />', () => {
  beforeEach(() => {
    mockAuthContextWithUser(beneficiaryUser)
    setFeatureFlags()
  })

  it('should open Zendesk url when clicking on "Contacter le service fraude" button', async () => {
    render(<GenericSuspendedAccount onBeforeNavigateContactFraudTeam={jest.fn()} />)

    const contactSupportButton = screen.getByText('Contacter le service fraude')
    await user.press(contactSupportButton)

    expect(openUrl).toHaveBeenCalledWith(
      buildZendeskUrlForFraud({
        user: beneficiaryUser,
        metrics: mockDeviceMetrics,
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

    expect(resetFromRef).toHaveBeenCalledWith(
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
    expect(mockSignOut).toHaveBeenCalledTimes(1)
  })
})

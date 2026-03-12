import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { buildZendeskUrlForFraud } from 'features/profile/helpers/buildZendeskUrl'
import { SuspensionChoiceExpiredLink } from 'features/trustedDevice/pages/SuspensionChoiceExpiredLink'
import { beneficiaryUser } from 'fixtures/user'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { render, screen, userEvent } from 'tests/utils'

const mockOpenUrl = jest.spyOn(NavigationHelpers, 'openUrl')

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

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<SuspensionChoiceExpiredLink/>', () => {
  beforeEach(() => {
    mockAuthContextWithUser(beneficiaryUser)
  })

  it('should match snapshot', () => {
    render(<SuspensionChoiceExpiredLink />)

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to home page when "Retourner à l’accueil" button is clicked', async () => {
    render(<SuspensionChoiceExpiredLink />)

    const goHomeButton = screen.getByText('Retourner à l’accueil')
    await user.press(goHomeButton)

    expect(navigate).toHaveBeenNthCalledWith(
      1,
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
  })

  it('should open Zendesk url when "Contacter le service fraude" button is clicked', async () => {
    render(<SuspensionChoiceExpiredLink />)

    const contactFraudButton = screen.getByText('Contacter le service fraude')
    await user.press(contactFraudButton)

    expect(mockOpenUrl).toHaveBeenCalledWith(
      buildZendeskUrlForFraud({
        user: beneficiaryUser,
        deviceInfo: mockDeviceInfo,
        version: mockVersion,
      }),
      undefined,
      true
    )
  })
})

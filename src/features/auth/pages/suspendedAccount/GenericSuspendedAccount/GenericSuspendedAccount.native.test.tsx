import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { GenericSuspendedAccount } from 'features/auth/pages/suspendedAccount/GenericSuspendedAccount/GenericSuspendedAccount'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { env } from 'libs/environment/env'
import { userEvent, render, screen } from 'tests/utils'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

const mockSignOut = jest.fn()
jest.mock('features/auth/helpers/useLogoutRoutine', () => ({
  useLogoutRoutine: jest.fn(() => mockSignOut.mockResolvedValueOnce(jest.fn())),
}))

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()
jest.useFakeTimers()

describe('<GenericSuspendedAccount />', () => {
  it('should open mail app when clicking on "Contacter le support" button', async () => {
    render(<GenericSuspendedAccount onBeforeNavigateContactFraudTeam={jest.fn()} />)

    const contactSupportButton = screen.getByText('Contacter le service fraude')
    await user.press(contactSupportButton)

    expect(openUrl).toHaveBeenCalledWith(`mailto:${env.FRAUD_EMAIL_ADDRESS}`, undefined, true)
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

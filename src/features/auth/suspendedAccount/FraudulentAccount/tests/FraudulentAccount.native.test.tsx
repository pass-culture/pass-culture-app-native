import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { navigateToHome, navigateToHomeConfig, openUrl } from 'features/navigation/helpers'
import { env } from 'libs/environment'
import { fireEvent, render } from 'tests/utils'

import { FraudulentAccount } from '../FraudulentAccount'

const mockSettings = {
  allowAccountUnsuspension: true,
}

jest.mock('features/navigation/helpers')

const mockSignOut = jest.fn()
jest.mock('features/auth/AuthContext', () => ({
  useLogoutRoutine: jest.fn(() => mockSignOut.mockResolvedValueOnce(jest.fn())),
}))

jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => ({
    data: mockSettings,
  })),
}))
const mockedOpenUrl = openUrl as jest.MockedFunction<typeof openUrl>

describe('<FraudulentAccount />', () => {
  it('should match snapshot', () => {
    expect(render(<FraudulentAccount />)).toMatchSnapshot()
  })

  it('should open mail app when clicking on contact service button', async () => {
    const { getByTestId } = render(<FraudulentAccount />)

    const contactFraudButton = getByTestId('Contacter le service')
    fireEvent.press(contactFraudButton)

    await waitForExpect(() => {
      expect(mockedOpenUrl).toBeCalledWith(`mailto:${env.FRAUD_EMAIL_ADDRESS}`, undefined)
    })
  })

  it('should go to home page when clicking on go to home button', async () => {
    const { getByTestId } = render(<FraudulentAccount />)

    const homeButton = getByTestId("Retourner à l'accueil")
    fireEvent.press(homeButton)

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith(navigateToHomeConfig.screen, navigateToHomeConfig.params)
      expect(mockSignOut).toBeCalledTimes(1)
    })
  })

  it('should redirect to home if feature is disabled', async () => {
    mockSettings.allowAccountUnsuspension = false
    render(<FraudulentAccount />)

    await waitForExpect(() => {
      expect(navigateToHome).toHaveBeenCalledTimes(1)
    })
  })
})

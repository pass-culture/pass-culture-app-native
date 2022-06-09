import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { contactSupport } from 'features/auth/support.services'
import { navigateToHome, navigateToHomeConfig, openUrl } from 'features/navigation/helpers'
import { fireEvent, render } from 'tests/utils/web'

import { FraudulentAccount } from '../FraudulentAccount'

const mockSettings = {
  allowAccountReactivation: true,
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

  it('should open mail app when clicking on contact support button', async () => {
    const { getByText } = render(<FraudulentAccount />)

    const contactSupportButton = getByText('Contacter le support')
    fireEvent.click(contactSupportButton)

    await waitForExpect(() => {
      expect(mockedOpenUrl).toBeCalledWith(
        contactSupport.forGenericQuestion.url,
        contactSupport.forGenericQuestion.params
      )
    })
  })

  it('should go to home page when clicking on go to home button', async () => {
    const { getByText } = render(<FraudulentAccount />)

    const homeButton = getByText("Retourner à l'accueil")
    fireEvent.click(homeButton)

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith(navigateToHomeConfig.screen, navigateToHomeConfig.params)
      expect(mockSignOut).toBeCalledTimes(1)
    })
  })

  it('should redirect to home if feature is disabled', async () => {
    mockSettings.allowAccountReactivation = false
    render(<FraudulentAccount />)

    await waitForExpect(() => {
      expect(navigateToHome).toHaveBeenCalledTimes(1)
    })
  })
})

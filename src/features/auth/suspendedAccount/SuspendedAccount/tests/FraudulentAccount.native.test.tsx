import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { contactSupport } from 'features/auth/support.services'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { navigateToHome, navigateToHomeConfig, openUrl } from 'features/navigation/helpers'
import { fireEvent, render } from 'tests/utils'

import { FraudulentAccount } from '../FraudulentAccount'

const mockSettings = {
  allowAccountReactivation: true,
}

jest.mock('features/navigation/helpers')
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

  it('should go back when clicking on go back icon', async () => {
    const { getByTestId } = render(<FraudulentAccount />)

    const leftIconButton = getByTestId('Revenir en arrière')
    fireEvent.press(leftIconButton)

    await waitForExpect(() => {
      expect(mockGoBack).toHaveBeenCalledTimes(1)
    })
  })

  it('should open mail app when clicking on contact support button', async () => {
    const { getByTestId } = render(<FraudulentAccount />)

    const contactSupportButton = getByTestId('Contacter le support')
    fireEvent.press(contactSupportButton)

    await waitForExpect(() => {
      expect(mockedOpenUrl).toBeCalledWith(
        contactSupport.forGenericQuestion.url,
        contactSupport.forGenericQuestion.params
      )
    })
  })

  it('should go to home page when clicking on go to home button', async () => {
    const { getByTestId } = render(<FraudulentAccount />)

    const homeButton = getByTestId("Retourner à l'accueil")
    fireEvent.press(homeButton)

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith(navigateToHomeConfig.screen, navigateToHomeConfig.params)
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

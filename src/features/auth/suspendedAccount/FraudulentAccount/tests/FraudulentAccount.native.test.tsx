import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { navigateToHomeConfig, openUrl } from 'features/navigation/helpers'
import { env } from 'libs/environment'
import { fireEvent, render } from 'tests/utils'

import { FraudulentAccount } from '../FraudulentAccount'

jest.mock('features/navigation/helpers')

const mockSignOut = jest.fn()
jest.mock('features/auth/logout/useLogoutRoutine', () => ({
  useLogoutRoutine: jest.fn(() => mockSignOut.mockResolvedValueOnce(jest.fn())),
}))

const mockedOpenUrl = openUrl as jest.MockedFunction<typeof openUrl>

describe('<FraudulentAccount />', () => {
  it('should match snapshot', () => {
    expect(render(<FraudulentAccount />)).toMatchSnapshot()
  })

  it('should open mail app when clicking on contact service button', async () => {
    const { getByTestId } = render(<FraudulentAccount />)

    const contactFraudButton = getByTestId('Ouvrir le gestionnaire mail pour contacter le support')
    fireEvent.press(contactFraudButton)

    await waitForExpect(() => {
      expect(mockedOpenUrl).toBeCalledWith(`mailto:${env.FRAUD_EMAIL_ADDRESS}`, undefined)
    })
  })

  it('should go to home page when clicking on go to home button', async () => {
    const { getByTestId } = render(<FraudulentAccount />)

    const homeButton = getByTestId('Retourner à l’accueil')
    fireEvent.press(homeButton)

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith(navigateToHomeConfig.screen, navigateToHomeConfig.params)
      expect(mockSignOut).toBeCalledTimes(1)
    })
  })
})

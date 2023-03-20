import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { navigateToHomeConfig, openUrl } from 'features/navigation/helpers'
import { env } from 'libs/environment'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { FraudulentAccount } from './FraudulentAccount'

jest.mock('features/navigation/helpers')

const mockSignOut = jest.fn()
jest.mock('features/auth/helpers/useLogoutRoutine', () => ({
  useLogoutRoutine: jest.fn(() => mockSignOut.mockResolvedValueOnce(jest.fn())),
}))

const mockedOpenUrl = openUrl as jest.MockedFunction<typeof openUrl>

describe('<FraudulentAccount />', () => {
  it('should match snapshot', () => {
    render(<FraudulentAccount />)

    expect(screen).toMatchSnapshot()
  })

  it('should open mail app when clicking on contact service button', () => {
    render(<FraudulentAccount />)

    const contactFraudButton = screen.getByText('Contacter le service')
    fireEvent.press(contactFraudButton)

    expect(mockedOpenUrl).toHaveBeenNthCalledWith(
      1,
      `mailto:${env.FRAUD_EMAIL_ADDRESS}`,
      undefined,
      true
    )
  })

  it('should go to home page when clicking on go to home button', async () => {
    render(<FraudulentAccount />)

    const homeButton = screen.getByText('Retourner à l’accueil')
    fireEvent.press(homeButton)

    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(
        1,
        navigateToHomeConfig.screen,
        navigateToHomeConfig.params
      )
      expect(mockSignOut).toBeCalledTimes(1)
    })
  })
})

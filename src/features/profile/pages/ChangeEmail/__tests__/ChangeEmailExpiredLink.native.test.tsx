import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { useAuthContext } from 'features/auth/AuthContext'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { ChangeEmailExpiredLink } from 'features/profile/pages/ChangeEmail/ChangeEmailExpiredLink'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render } from 'tests/utils'

jest.mock('features/navigation/helpers')
jest.mock('features/navigation/navigationRef')

jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>
const mockUserLoggedOutOnce = () => {
  mockUseAuthContext.mockReturnValueOnce({ isLoggedIn: false, setIsLoggedIn: jest.fn() })
}

describe('<ChangeEmailExpiredLink />', () => {
  beforeEach(() => {
    mockUseAuthContext.mockReturnValue({ isLoggedIn: true, setIsLoggedIn: jest.fn() })
  })

  it('should render correctly', () => {
    const renderAPI = render(<ChangeEmailExpiredLink />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should render correctly when logged out', () => {
    mockUserLoggedOutOnce()

    const renderAPI = render(<ChangeEmailExpiredLink />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should redirect to home page when go back to home button is clicked', async () => {
    const { getByText } = await render(<ChangeEmailExpiredLink />)

    fireEvent.press(getByText(`Retourner à l’accueil`))

    await waitForExpect(() => {
      expect(navigateFromRef).toBeCalledWith(
        navigateToHomeConfig.screen,
        navigateToHomeConfig.params
      )
    })
  })

  it('should navigate when clicking on resend email button', async () => {
    const { getByText } = render(<ChangeEmailExpiredLink />)

    const resendEmailButton = getByText('Faire une nouvelle demande')
    fireEvent.press(resendEmailButton)

    await waitForExpect(() => {
      expect(navigate).toHaveBeenCalledWith('ChangeEmail')
    })
  })

  it('should log event when clicking on resend email button', async () => {
    const { getByText } = render(<ChangeEmailExpiredLink />)

    const resendEmailButton = getByText('Faire une nouvelle demande')
    fireEvent.press(resendEmailButton)

    await waitForExpect(() => {
      expect(analytics.logSendActivationMailAgain).toHaveBeenCalledWith(1)
    })

    fireEvent.press(resendEmailButton)
    await waitForExpect(() => {
      expect(analytics.logSendActivationMailAgain).toHaveBeenCalledWith(2)
    })
  })

  it('should navigate when clicking on resend email button when logged out', async () => {
    mockUserLoggedOutOnce()

    const { getByText } = render(<ChangeEmailExpiredLink />)

    const resendEmailButton = getByText('Se connecter')
    fireEvent.press(resendEmailButton)

    await waitForExpect(() => {
      expect(navigate).toHaveBeenCalledWith('Login')
    })
  })
})

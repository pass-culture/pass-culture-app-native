import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { ChangeEmailExpiredLink } from 'features/profile/pages/ChangeEmail/ChangeEmailExpiredLink'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('features/navigation/helpers')
jest.mock('features/navigation/navigationRef')

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>
const mockUserLoggedOutOnce = () => {
  mockUseAuthContext.mockReturnValueOnce({
    isLoggedIn: false,
    setIsLoggedIn: jest.fn(),
    refetchUser: jest.fn(),
    isUserLoading: false,
  })
}

describe('<ChangeEmailExpiredLink />', () => {
  beforeEach(() => {
    mockUseAuthContext.mockReturnValue({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    })
  })

  it('should render correctly', () => {
    render(<ChangeEmailExpiredLink />)

    expect(screen).toMatchSnapshot()
  })

  it('should render correctly when logged out', () => {
    mockUserLoggedOutOnce()
    render(<ChangeEmailExpiredLink />)

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to home page when go back to home button is clicked', () => {
    render(<ChangeEmailExpiredLink />)

    fireEvent.press(screen.getByText(`Retourner à l’accueil`))

    expect(navigateFromRef).toBeCalledWith(navigateToHomeConfig.screen, navigateToHomeConfig.params)
  })

  it('should navigate when clicking on resend email button', () => {
    render(<ChangeEmailExpiredLink />)

    const resendEmailButton = screen.getByText('Faire une nouvelle demande')
    fireEvent.press(resendEmailButton)

    expect(navigate).toHaveBeenCalledWith('ChangeEmail')
  })

  it('should log event when clicking on resend email button', () => {
    render(<ChangeEmailExpiredLink />)

    const resendEmailButton = screen.getByText('Faire une nouvelle demande')
    fireEvent.press(resendEmailButton)

    expect(analytics.logSendActivationMailAgain).toHaveBeenCalledWith(1)

    fireEvent.press(resendEmailButton)

    expect(analytics.logSendActivationMailAgain).toHaveBeenCalledWith(2)
  })

  it('should navigate when clicking on resend email button when logged out', () => {
    mockUserLoggedOutOnce()

    render(<ChangeEmailExpiredLink />)

    const resendEmailButton = screen.getByText('Se connecter')
    fireEvent.press(resendEmailButton)

    expect(navigate).toHaveBeenCalledWith('Login')
  })
})

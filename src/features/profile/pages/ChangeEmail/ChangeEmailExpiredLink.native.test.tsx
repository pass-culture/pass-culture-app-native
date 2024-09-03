import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { ChangeEmailExpiredLink } from 'features/profile/pages/ChangeEmail/ChangeEmailExpiredLink'
import { nonBeneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics'
import { mockAuthContextWithoutUser, mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/navigationRef')

jest.mock('features/auth/context/AuthContext')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

describe('<ChangeEmailExpiredLink />', () => {
  beforeEach(() => {
    mockAuthContextWithUser(nonBeneficiaryUser, { persist: true })
  })

  it('should render correctly', () => {
    render(<ChangeEmailExpiredLink />)

    expect(screen).toMatchSnapshot()
  })

  it('should render correctly when logged out', () => {
    mockAuthContextWithoutUser()
    render(<ChangeEmailExpiredLink />)

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to home page when go back to home button is clicked', () => {
    render(<ChangeEmailExpiredLink />)

    fireEvent.press(screen.getByText(`Retourner à l’accueil`))

    expect(navigateFromRef).toHaveBeenCalledWith(
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
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
    mockAuthContextWithoutUser()

    render(<ChangeEmailExpiredLink />)

    const resendEmailButton = screen.getByText('Se connecter')
    fireEvent.press(resendEmailButton)

    expect(navigate).toHaveBeenCalledWith('Login')
  })
})

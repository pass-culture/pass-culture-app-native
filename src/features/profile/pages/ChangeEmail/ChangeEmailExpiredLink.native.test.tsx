import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { ChangeEmailExpiredLink } from 'features/profile/pages/ChangeEmail/ChangeEmailExpiredLink'
import { nonBeneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import { mockAuthContextWithoutUser, mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/navigationRef')

jest.mock('features/auth/context/AuthContext')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()

jest.useFakeTimers()

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

  it('should redirect to home page when go back to home button is clicked', async () => {
    render(<ChangeEmailExpiredLink />)

    await user.press(screen.getByText(`Retourner à l’accueil`))

    expect(navigateFromRef).toHaveBeenCalledWith(
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
  })

  it('should navigate when clicking on resend email button', async () => {
    render(<ChangeEmailExpiredLink />)

    const resendEmailButton = screen.getByText('Faire une nouvelle demande')
    await user.press(resendEmailButton)

    expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
      params: undefined,
      screen: 'ChangeEmail',
    })
  })

  it('should log event when clicking on resend email button', async () => {
    render(<ChangeEmailExpiredLink />)

    const resendEmailButton = screen.getByText('Faire une nouvelle demande')
    await user.press(resendEmailButton)

    expect(analytics.logSendActivationMailAgain).toHaveBeenCalledWith(1)

    await user.press(resendEmailButton)

    expect(analytics.logSendActivationMailAgain).toHaveBeenCalledWith(2)
  })

  it('should navigate when clicking on resend email button when logged out', async () => {
    mockAuthContextWithoutUser()

    render(<ChangeEmailExpiredLink />)

    const resendEmailButton = screen.getByText('Se connecter')
    await user.press(resendEmailButton)

    expect(navigate).toHaveBeenCalledWith('Login')
  })
})

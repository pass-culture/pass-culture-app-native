import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, fireEvent, waitFor, act, screen } from 'tests/utils'

import { SignupConfirmationExpiredLink } from './SignupConfirmationExpiredLink'

jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/navigationRef')

const navigationProps = { route: { params: { email: 'test@email.com' } } }

function renderSignupConfirmationExpiredLink() {
  return render(
    reactQueryProviderHOC(
      <SignupConfirmationExpiredLink
        {...(navigationProps as StackScreenProps<
          RootStackParamList,
          'SignupConfirmationExpiredLink'
        >)}
      />
    )
  )
}

jest.mock('libs/firebase/analytics/analytics')

describe('<SignupConfirmationExpiredLink/>', () => {
  it('should redirect to home page WHEN go back to home button is clicked', async () => {
    renderSignupConfirmationExpiredLink()

    const button = screen.getByText('Retourner à l’accueil')
    fireEvent.press(button)

    await waitFor(() => {
      expect(navigateFromRef).toHaveBeenCalledWith(
        navigateToHomeConfig.screen,
        navigateToHomeConfig.params
      )
    })
  })

  it('should redirect to signup confirmation email sent page WHEN clicking on resend email and response is success', async () => {
    mockServer.postApi('/v1/resend_email_validation', {})
    renderSignupConfirmationExpiredLink()

    fireEvent.press(screen.getByText(`Renvoyer l’email`))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledTimes(1)
    })

    expect(analytics.logResendEmailSignupConfirmationExpiredLink).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith('SignupConfirmationEmailSent', {
      email: 'test@email.com',
    })
  })

  it('should NOT redirect to signup confirmation email sent page WHEN clicking on resend email and response is failure', async () => {
    mockServer.postApi('/v1/resend_email_validation', {
      responseOptions: { statusCode: 400 },
    })
    renderSignupConfirmationExpiredLink()

    await act(async () => {
      fireEvent.press(screen.getByText(`Renvoyer l’email`))
    })

    expect(navigate).not.toHaveBeenCalled()
  })
})

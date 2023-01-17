import { StackScreenProps } from '@react-navigation/stack'
import { rest } from 'msw'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { render, fireEvent, waitFor } from 'tests/utils'

import { SignupConfirmationExpiredLink } from './SignupConfirmationExpiredLink'

jest.mock('features/navigation/helpers')
jest.mock('features/navigation/navigationRef')

const navigationProps = { route: { params: { email: 'test@email.com' } } }

function renderSignupConfirmationExpiredLink() {
  return render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
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

describe('<SignupConfirmationExpiredLink/>', () => {
  it('should redirect to home page WHEN go back to home button is clicked', async () => {
    const { getByText } = renderSignupConfirmationExpiredLink()

    const button = getByText('Retourner à l’accueil')
    fireEvent.press(button)

    await waitFor(() => {
      expect(navigateFromRef).toHaveBeenCalledWith(
        navigateToHomeConfig.screen,
        navigateToHomeConfig.params
      )
    })
  })

  it('should redirect to signup confirmation email sent page WHEN clicking on resend email and response is success', async () => {
    const { getByText } = renderSignupConfirmationExpiredLink()

    fireEvent.press(getByText(`Renvoyer l’email`))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledTimes(1)
    })
    expect(analytics.logResendEmailSignupConfirmationExpiredLink).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith('SignupConfirmationEmailSent', {
      email: 'test@email.com',
    })
  })

  it('should NOT redirect to signup confirmation email sent page WHEN clicking on resend email and response is failure', async () => {
    server.use(
      rest.post(env.API_BASE_URL + '/native/v1/resend_email_validation', async (req, res, ctx) =>
        res.once(ctx.status(400))
      )
    )
    const { getByText } = renderSignupConfirmationExpiredLink()

    fireEvent.press(getByText(`Renvoyer l’email`))

    await waitFor(() => {
      expect(navigate).not.toHaveBeenCalled()
    })
  })
})

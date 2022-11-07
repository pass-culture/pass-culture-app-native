import { StackScreenProps } from '@react-navigation/stack'
import { rest } from 'msw'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { render, fireEvent } from 'tests/utils/web'

import { SignupConfirmationExpiredLink } from '../../SignupConfirmationExpiredLink/SignupConfirmationExpiredLink'

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
    const { findByText } = renderSignupConfirmationExpiredLink()

    const button = await findByText('Retourner à l’accueil')
    fireEvent.click(button)

    await waitForExpect(() => {
      expect(navigateFromRef).toBeCalledWith(
        navigateToHomeConfig.screen,
        navigateToHomeConfig.params
      )
    })
  })

  it('should redirect to signup confirmation email sent page WHEN clicking on resend email and response is success', async () => {
    const { getByText } = renderSignupConfirmationExpiredLink()

    await fireEvent.click(getByText(`Renvoyer l’email`))

    await waitForExpect(() => {
      expect(navigate).toBeCalledTimes(1)
    })
    expect(analytics.logResendEmailSignupConfirmationExpiredLink).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('SignupConfirmationEmailSent', {
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

    fireEvent.click(getByText(`Renvoyer l’email`))

    await waitForExpect(() => {
      expect(navigate).not.toBeCalled()
    })
  })
})

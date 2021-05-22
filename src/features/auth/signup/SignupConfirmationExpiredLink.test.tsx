import { StackScreenProps } from '@react-navigation/stack'
import { rest } from 'msw'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { navigateToHome } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { superFlushWithAct, render, fireEvent } from 'tests/utils'

import { contactSupport } from '../support.services'

import { SignupConfirmationExpiredLink } from './SignupConfirmationExpiredLink'

jest.mock('features/navigation/helpers')

beforeEach(() => {
  jest.clearAllMocks()
})

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

describe('<SignupConfirmationExpiredLink/>', () => {
  it('should redirect to home page WHEN go back to home button is clicked', async () => {
    const { findByText } = renderSignupConfirmationExpiredLink()

    const button = await findByText("Retourner à l'accueil")
    fireEvent.press(button)

    await waitForExpect(() => {
      expect(navigateToHome).toBeCalledTimes(1)
    })
  })

  it.skip('should contact support WHEN contact support button is clicked', async () => {
    const { findByText } = renderSignupConfirmationExpiredLink()

    const button = await findByText('Contacter le support')
    fireEvent.press(button)

    await waitForExpect(() => {
      expect(contactSupport.forSignupConfirmationExpiredLink).toBeCalledTimes(1)
      expect(contactSupport.forSignupConfirmationExpiredLink).toBeCalledWith('test@email.com')
    })
  })

  it('should redirect to signup confirmation email sent page WHEN clicking on resend email and response is success', async () => {
    const { getByText } = renderSignupConfirmationExpiredLink()

    fireEvent.press(getByText(`Renvoyer l'email`))
    await superFlushWithAct()

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
        res.once(ctx.status(403))
      )
    )
    const { getByText } = renderSignupConfirmationExpiredLink()

    fireEvent.press(getByText(`Renvoyer l'email`))
    await superFlushWithAct()

    await waitForExpect(() => {
      expect(navigate).not.toBeCalled()
    })
  })
})

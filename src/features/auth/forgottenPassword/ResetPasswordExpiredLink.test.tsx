import { StackScreenProps } from '@react-navigation/stack'
import { render, fireEvent } from '@testing-library/react-native'
import { rest } from 'msw'
import React from 'react'
import { Alert } from 'react-native'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { server } from 'tests/server'

import { contactSupport } from '../support.services'

import { ResetPasswordExpiredLink } from './ResetPasswordExpiredLink'

beforeEach(() => {
  jest.clearAllMocks()
})

const navigationProps = { route: { params: { email: 'test@email.com' } } }

function renderResetPasswordExpiredLink() {
  return render(
    <ResetPasswordExpiredLink
      {...(navigationProps as StackScreenProps<RootStackParamList, 'ResetPasswordExpiredLink'>)}
    />
  )
}

describe('<ResetPasswordExpiredLink/>', () => {
  it('should redirect to home page WHEN go back to home button is clicked', async () => {
    const { findByText } = renderResetPasswordExpiredLink()

    const button = await findByText("Retourner à l'accueil")
    fireEvent.press(button)

    await waitForExpect(() => {
      expect(navigate).toBeCalledTimes(1)
    })
  })

  it('should contact support WHEN contact support button is clicked', async () => {
    const { findByText } = renderResetPasswordExpiredLink()

    const button = await findByText('Contacter le support')
    fireEvent.press(button)

    await waitForExpect(() => {
      expect(contactSupport.forResetPasswordExpiredLink).toBeCalledTimes(1)
      expect(contactSupport.forResetPasswordExpiredLink).toBeCalledWith('test@email.com')
    })
  })

  it('should redirect to reset password link sent page WHEN clicking on resend email and response is success', async () => {
    const { findByText } = renderResetPasswordExpiredLink()

    const button = await findByText("Renvoyer l'email")
    fireEvent.press(button)

    await waitForExpect(() => {
      expect(analytics.logResendEmailResetPasswordExpiredLink).toBeCalledTimes(1)
      expect(navigate).toBeCalledTimes(1)
      expect(navigate).toBeCalledWith('ResetPasswordEmailSent', {
        email: 'test@email.com',
      })
    })
  })

  it('should NOT redirect to reset password link sent page WHEN clicking on resend email and response is failure', async () => {
    server.use(
      rest.post(env.API_BASE_URL + '/native/v1/request_password_reset', async (req, res, ctx) =>
        res.once(ctx.status(403))
      )
    )

    const { findByText } = renderResetPasswordExpiredLink()

    const button = await findByText("Renvoyer l'email")
    fireEvent.press(button)

    await waitForExpect(() => {
      expect(navigate).not.toBeCalled()
      expect(Alert.alert).toBeCalledTimes(1)
    })
  })
})

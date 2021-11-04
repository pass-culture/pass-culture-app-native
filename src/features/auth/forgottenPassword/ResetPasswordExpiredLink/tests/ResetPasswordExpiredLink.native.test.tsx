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

import { ResetPasswordExpiredLink } from '../ResetPasswordExpiredLink'

jest.mock('features/navigation/helpers')

describe('<ResetPasswordExpiredLink/>', () => {
  it('should redirect to home page WHEN go back to home button is clicked', async () => {
    const { getByText } = await renderResetPasswordExpiredLink()

    fireEvent.press(getByText(`Retourner à l'accueil`))

    await waitForExpect(() => {
      expect(navigateToHome).toBeCalledTimes(1)
    })
  })

  it('should redirect to reset password link sent page WHEN clicking on resend email and response is success', async () => {
    const { getByText } = await renderResetPasswordExpiredLink()

    fireEvent.press(getByText(`Renvoyer l'email`))
    await superFlushWithAct()

    await waitForExpect(() => {
      expect(navigate).toBeCalledTimes(1)
    })
    expect(analytics.logResendEmailResetPasswordExpiredLink).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('ResetPasswordEmailSent', {
      email: 'test@email.com',
    })
  })

  it('should NOT redirect to reset password link sent page WHEN clicking on resend email and response is failure', async () => {
    server.use(
      rest.post(env.API_BASE_URL + '/native/v1/request_password_reset', async (req, res, ctx) =>
        res.once(ctx.status(403))
      )
    )
    const { getByText } = await renderResetPasswordExpiredLink()

    fireEvent.press(getByText(`Renvoyer l'email`))
    await superFlushWithAct()

    await waitForExpect(() => {
      expect(navigate).not.toBeCalled()
    })
  })
})

const navigationProps = { route: { params: { email: 'test@email.com' } } }

async function renderResetPasswordExpiredLink() {
  const renderAPI = render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <ResetPasswordExpiredLink
        {...(navigationProps as StackScreenProps<RootStackParamList, 'ResetPasswordExpiredLink'>)}
      />
    )
  )
  await superFlushWithAct()
  return renderAPI
}

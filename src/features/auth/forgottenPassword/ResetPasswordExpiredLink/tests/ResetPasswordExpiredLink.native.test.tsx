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

import { ResetPasswordExpiredLink } from '../ResetPasswordExpiredLink'

jest.mock('features/navigation/helpers')
jest.mock('features/navigation/navigationRef')

describe('<ResetPasswordExpiredLink/>', () => {
  it('should redirect to home page WHEN go back to home button is clicked', async () => {
    const { getByText } = renderResetPasswordExpiredLink()

    fireEvent.press(getByText(`Retourner à l’accueil`))

    await waitFor(() => {
      expect(navigateFromRef).toHaveBeenCalledWith(
        navigateToHomeConfig.screen,
        navigateToHomeConfig.params
      )
    })
  })

  it('should redirect to reset password link sent page WHEN clicking on resend email and response is success', async () => {
    const { getByText } = renderResetPasswordExpiredLink()

    fireEvent.press(getByText(`Renvoyer l’email`))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledTimes(1)
    })
    expect(analytics.logResendEmailResetPasswordExpiredLink).toHaveBeenCalledTimes(1)
    expect(navigate).toBeCalledWith('ResetPasswordEmailSent', {
      email: 'test@email.com',
    })
  })

  it('should NOT redirect to reset password link sent page WHEN clicking on resend email and response is failure', async () => {
    server.use(
      rest.post(env.API_BASE_URL + '/native/v1/request_password_reset', async (req, res, ctx) =>
        res.once(ctx.status(401))
      )
    )
    const { getByText } = renderResetPasswordExpiredLink()

    fireEvent.press(getByText(`Renvoyer l’email`))

    await waitFor(() => {
      expect(navigate).not.toHaveBeenCalled()
    })
  })
})

const navigationProps = { route: { params: { email: 'test@email.com' } } }

function renderResetPasswordExpiredLink() {
  const renderAPI = render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <ResetPasswordExpiredLink
        {...(navigationProps as StackScreenProps<RootStackParamList, 'ResetPasswordExpiredLink'>)}
      />
    )
  )
  return renderAPI
}

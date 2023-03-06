import { StackScreenProps } from '@react-navigation/stack'
import { rest } from 'msw'
import React from 'react'
import * as ReactQueryAPI from 'react-query'

import { navigate } from '__mocks__/@react-navigation/native'
import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { render, fireEvent, screen, waitFor, flushAllPromisesWithAct } from 'tests/utils'

import { ResetPasswordExpiredLink } from './ResetPasswordExpiredLink'

const useQuerySpy = jest.spyOn(ReactQueryAPI, 'useQuery')

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
      rest.post(env.API_BASE_URL + '/native/v1/request_password_reset', async (_req, res, ctx) =>
        res(ctx.status(401))
      )
    )

    const ResetPasswordExpiredLinkWithBoundary = withAsyncErrorBoundary(ResetPasswordExpiredLink)
    render(
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      reactQueryProviderHOC(<ResetPasswordExpiredLinkWithBoundary {...navigationProps} />)
    )

    fireEvent.press(screen.getByText(`Renvoyer l’email`))
    await flushAllPromisesWithAct()

    expect(useQuerySpy).toThrowError()
  })
})

const navigationProps = {
  route: { params: { email: 'test@email.com' } },
} as StackScreenProps<RootStackParamList, 'ResetPasswordExpiredLink'>

function renderResetPasswordExpiredLink() {
  const renderAPI = render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(<ResetPasswordExpiredLink {...navigationProps} />)
  )
  return renderAPI
}

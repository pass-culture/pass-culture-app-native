import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import * as ReactQueryAPI from 'react-query'

import { navigate } from '__mocks__/@react-navigation/native'
import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, fireEvent, screen, waitFor, act } from 'tests/utils'

import { ResetPasswordExpiredLink } from './ResetPasswordExpiredLink'

const useQuerySpy = jest.spyOn(ReactQueryAPI, 'useQuery')

jest.mock('features/navigation/helpers')
jest.mock('features/navigation/navigationRef')

describe('<ResetPasswordExpiredLink/>', () => {
  it('should redirect to home page WHEN go back to home button is clicked', async () => {
    mockServer.postApiV1('/request_password_reset', {})
    renderResetPasswordExpiredLink()

    fireEvent.press(screen.getByText(`Retourner à l’accueil`))

    await waitFor(() => {
      expect(navigateFromRef).toHaveBeenCalledWith(
        navigateToHomeConfig.screen,
        navigateToHomeConfig.params
      )
    })
  })

  it('should redirect to reset password link sent page WHEN clicking on resend email and response is success', async () => {
    mockServer.postApiV1('/request_password_reset', {
      responseOptions: { statusCode: 204, data: {} },
    })
    renderResetPasswordExpiredLink()

    fireEvent.press(screen.getByText(`Renvoyer l’email`))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledTimes(1)
    })

    expect(analytics.logResendEmailResetPasswordExpiredLink).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith('ResetPasswordEmailSent', {
      email: 'test@email.com',
    })
  })

  it('should NOT redirect to reset password link sent page WHEN clicking on resend email and response is failure', async () => {
    mockServer.postApiV1('/request_password_reset', {
      responseOptions: { statusCode: 401, data: {} },
    })

    const ResetPasswordExpiredLinkWithBoundary = withAsyncErrorBoundary(ResetPasswordExpiredLink)
    render(reactQueryProviderHOC(<ResetPasswordExpiredLinkWithBoundary {...navigationProps} />))

    await act(async () => {
      fireEvent.press(screen.getByText(`Renvoyer l’email`))
    })

    expect(useQuerySpy).toThrow()
  })
})

const navigationProps = {
  route: { params: { email: 'test@email.com' } },
} as StackScreenProps<RootStackParamList, 'ResetPasswordExpiredLink'>

function renderResetPasswordExpiredLink() {
  render(reactQueryProviderHOC(<ResetPasswordExpiredLink {...navigationProps} />))
}

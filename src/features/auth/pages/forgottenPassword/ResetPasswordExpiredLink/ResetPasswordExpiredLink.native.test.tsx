import { StackScreenProps } from '@react-navigation/stack'
import * as ReactQueryAPI from '@tanstack/react-query'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { userEvent, render, screen, waitFor } from 'tests/utils'

import { ResetPasswordExpiredLink } from './ResetPasswordExpiredLink'

const useQuerySpy = jest.spyOn(ReactQueryAPI, 'useQuery')

jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/navigationRef')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<ResetPasswordExpiredLink/>', () => {
  it('should redirect to home page WHEN go back to home button is clicked', async () => {
    mockServer.postApi('/v1/request_password_reset', {})
    renderResetPasswordExpiredLink()

    await user.press(screen.getByText(`Retourner à l’accueil`))

    expect(navigateFromRef).toHaveBeenCalledWith(
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
  })

  it('should redirect to reset password link sent page WHEN clicking on resend email and response is success', async () => {
    mockServer.postApi('/v1/request_password_reset', {
      responseOptions: { statusCode: 204, data: {} },
    })
    renderResetPasswordExpiredLink()

    await user.press(screen.getByText(`Renvoyer l’email`))

    expect(analytics.logResendEmailResetPasswordExpiredLink).toHaveBeenCalledTimes(1)

    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith('ResetPasswordEmailSent', {
        email: 'test@email.com',
      })
    )
  })

  it('should NOT redirect to reset password link sent page WHEN clicking on resend email and response is failure', async () => {
    mockServer.postApi('/v1/request_password_reset', {
      responseOptions: { statusCode: 401, data: {} },
    })

    const ResetPasswordExpiredLinkWithBoundary = withAsyncErrorBoundary(ResetPasswordExpiredLink)
    render(reactQueryProviderHOC(<ResetPasswordExpiredLinkWithBoundary {...navigationProps} />))

    await user.press(screen.getByText(`Renvoyer l’email`))

    expect(useQuerySpy).toThrow()
  })
})

const navigationProps = {
  route: { params: { email: 'test@email.com' } },
} as StackScreenProps<RootStackParamList, 'ResetPasswordExpiredLink'>

function renderResetPasswordExpiredLink() {
  render(reactQueryProviderHOC(<ResetPasswordExpiredLink {...navigationProps} />))
}

import React from 'react'
import { openInbox } from 'react-native-email-link'

import { navigate, replace, reset } from '__mocks__/@react-navigation/native'
import { EmailHistoryEventTypeEnum, EmailUpdateStatusResponse } from 'api/gen'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { TrackEmailChangeContent } from 'features/profile/pages/TrackEmailChange/TrackEmailChangeContent'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent, waitFor } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')

jest.mock('libs/jwt/jwt')
const mockUseAuthContext = jest.fn().mockReturnValue({ user: nonBeneficiaryUser })
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
}))
jest.mock('features/navigation/helpers/navigateToHome')

const trackEmailChangeContentFixture: EmailUpdateStatusResponse = {
  status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
  expired: false,
  newEmail: undefined,
  hasRecentlyResetPassword: false,
}

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('TrackEmailChangeContent', () => {
  it('should open mail app when pressing first step and first step is active', async () => {
    mockServer.getApi<EmailUpdateStatusResponse>(
      '/v2/profile/email_update/status',
      trackEmailChangeContentFixture
    )

    render(reactQueryProviderHOC(<TrackEmailChangeContent />))

    await user.press(screen.getByText('Confirme ta demande'))

    expect(openInbox).toHaveBeenCalledTimes(1)
  })

  it('should navigate to email selection page when pressing second step and second step is active', async () => {
    mockServer.getApi<EmailUpdateStatusResponse>('/v2/profile/email_update/status', {
      ...trackEmailChangeContentFixture,
      status: EmailHistoryEventTypeEnum.CONFIRMATION,
      token: 'new_email_selection_token',
    })

    render(reactQueryProviderHOC(<TrackEmailChangeContent />))

    await user.press(await screen.findByText('Choisis ta nouvelle adresse e-mail'))

    expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
      params: {
        token: 'new_email_selection_token',
      },
      screen: 'NewEmailSelection',
    })
  })

  it('should open mail app when pressing last step and last step is active', async () => {
    mockServer.getApi<EmailUpdateStatusResponse>('/v2/profile/email_update/status', {
      ...trackEmailChangeContentFixture,
      status: EmailHistoryEventTypeEnum.NEW_EMAIL_SELECTION,
      newEmail: 'new_email@test.com',
    })

    render(reactQueryProviderHOC(<TrackEmailChangeContent />))

    await user.press(await screen.findByText('Valide ta nouvelle adresse'))

    expect(openInbox).toHaveBeenCalledTimes(1)
  })

  it('should navigate to home when status is empty', async () => {
    mockServer.getApi('/v2/profile/email_update/status', {
      ...trackEmailChangeContentFixture,
      status: undefined,
      newEmail: 'new_email@test.com',
    })
    render(reactQueryProviderHOC(<TrackEmailChangeContent />))

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith(...homeNavigationConfig)
    })
  })

  it('should navigate to ChangeEmailExpiredLink when request is expired', async () => {
    mockServer.getApi<EmailUpdateStatusResponse>('/v2/profile/email_update/status', {
      ...trackEmailChangeContentFixture,
      expired: true,
    })
    render(reactQueryProviderHOC(<TrackEmailChangeContent />))

    await waitFor(() => {
      expect(reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'ChangeEmailExpiredLink' }] })
    })
  })

  describe('account without password (sso)', () => {
    beforeAll(() => {
      mockUseAuthContext.mockReturnValue({ user: { ...beneficiaryUser, hasPassword: false } })
    })

    afterAll(() => mockUseAuthContext.mockReturnValue({ user: beneficiaryUser }))

    it('should navigate to password creation page when pressing second step and second step is active and user has no password', async () => {
      mockServer.getApi<EmailUpdateStatusResponse>('/v2/profile/email_update/status', {
        ...trackEmailChangeContentFixture,
        status: EmailHistoryEventTypeEnum.CONFIRMATION,
        resetPasswordToken: 'reset_password_token',
        token: 'new_email_selection_token',
      })

      render(reactQueryProviderHOC(<TrackEmailChangeContent />))

      await user.press(await screen.findByText('Crée ton mot de passe'))

      expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
        params: {
          emailSelectionToken: 'new_email_selection_token',
          token: 'reset_password_token',
        },
        screen: 'ChangeEmailSetPassword',
      })
    })
  })
})

import React from 'react'
import { openInbox } from 'react-native-email-link'

import { navigate } from '__mocks__/@react-navigation/native'
import { EmailHistoryEventTypeEnum, EmailUpdateStatusResponse } from 'api/gen'
import { navigateToHome } from 'features/navigation/helpers'
import { TrackEmailChangeContent } from 'features/profile/pages/TrackEmailChange/TrackEmailChangeContent'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')

jest.mock('features/navigation/helpers')

const trackEmailChangeContentFixture: EmailUpdateStatusResponse = {
  status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
  expired: false,
  newEmail: undefined,
}

describe('TrackEmailChangeContent', () => {
  it('should open mail app when pressing first step and first step is active', async () => {
    mockServer.getApi<EmailUpdateStatusResponse>(
      '/v2/profile/email_update/status',
      trackEmailChangeContentFixture
    )

    render(reactQueryProviderHOC(<TrackEmailChangeContent />))

    fireEvent.press(await screen.findByText('Confirme ta demande'))

    expect(openInbox).toHaveBeenCalledTimes(1)
  })

  it('should navigate to TrackEmailChange when pressing second step and second step is active', async () => {
    mockServer.getApi<EmailUpdateStatusResponse>('/v2/profile/email_update/status', {
      ...trackEmailChangeContentFixture,
      status: EmailHistoryEventTypeEnum.CONFIRMATION,
    })

    render(reactQueryProviderHOC(<TrackEmailChangeContent />))

    fireEvent.press(await screen.findByText('Choisis ta nouvelle adresse e-mail'))

    expect(navigate).toHaveBeenCalledWith('TrackEmailChange', undefined)
  })

  it('should open mail app when pressing last step and last step is active', async () => {
    mockServer.getApi<EmailUpdateStatusResponse>('/v2/profile/email_update/status', {
      ...trackEmailChangeContentFixture,
      status: EmailHistoryEventTypeEnum.NEW_EMAIL_SELECTION,
      newEmail: 'new_email@test.com',
    })

    render(reactQueryProviderHOC(<TrackEmailChangeContent />))

    fireEvent.press(await screen.findByText('Valide ta nouvelle adresse'))

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
      expect(navigateToHome).toHaveBeenCalledTimes(1)
    })
  })

  it('should navigate to ChangeEmailExpiredLink when request is expired', async () => {
    mockServer.getApi<EmailUpdateStatusResponse>('/v2/profile/email_update/status', {
      ...trackEmailChangeContentFixture,
      expired: true,
    })
    render(reactQueryProviderHOC(<TrackEmailChangeContent />))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('ChangeEmailExpiredLink')
    })
  })
})

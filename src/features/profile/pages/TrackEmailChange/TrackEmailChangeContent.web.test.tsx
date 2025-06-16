import React from 'react'
import { openInbox } from 'react-native-email-link'

import { EmailHistoryEventTypeEnum, EmailUpdateStatusResponse } from 'api/gen'
import { TrackEmailChangeContent } from 'features/profile/pages/TrackEmailChange/TrackEmailChangeContent'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils/web'

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/jwt/jwt')
jest.mock('ui/theme/customFocusOutline/customFocusOutline')

describe('TrackEmailChangeContent', () => {
  it('should not open mail app when clicking first step and first step is active', async () => {
    mockServer.getApi<EmailUpdateStatusResponse>('/v2/profile/email_update/status', {
      status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
      expired: false,
      newEmail: 'new_email@test.com',
      hasRecentlyResetPassword: false,
    })

    await renderTrackEmailChangeContent()

    fireEvent.click(await screen.findByText('Confirme ta demande'))

    expect(openInbox).not.toHaveBeenCalledTimes(1)
  })

  it('should not open mail app when clicking last step and last step is active', async () => {
    mockServer.getApi<EmailUpdateStatusResponse>('/v2/profile/email_update/status', {
      status: EmailHistoryEventTypeEnum.NEW_EMAIL_SELECTION,
      expired: false,
      newEmail: 'new_email@test.com',
      hasRecentlyResetPassword: false,
    })

    await renderTrackEmailChangeContent()

    fireEvent.click(await screen.findByText('Valide ta nouvelle adresse'))

    expect(openInbox).not.toHaveBeenCalledTimes(1)
  })
})

const renderTrackEmailChangeContent = async () =>
  act(async () => {
    return render(reactQueryProviderHOC(<TrackEmailChangeContent />))
  })

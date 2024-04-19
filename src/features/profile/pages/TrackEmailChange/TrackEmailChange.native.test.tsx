import React from 'react'
import { act } from 'react-test-renderer'

import { EmailHistoryEventTypeEnum, EmailUpdateStatus, EmailUpdateStatusResponse } from 'api/gen'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { TrackEmailChange } from 'features/profile/pages/TrackEmailChange/TrackEmailChange'
import { nonBeneficiaryUser } from 'fixtures/user'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen } from 'tests/utils'

const mockUseAuthContext = jest.fn().mockReturnValue({ user: nonBeneficiaryUser })
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
}))

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

describe('TrackEmailChange', () => {
  it('should render correctly when FF is disabled', async () => {
    mockServer.getApi<EmailUpdateStatus>('/v1/profile/email_update/status', {
      expired: false,
      newEmail: '',
      status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
    })
    render(reactQueryProviderHOC(<TrackEmailChange />))

    await act(() => {})

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to previous screen when clicking on ArrowPrevious icon', async () => {
    mockServer.getApi<EmailUpdateStatus>('/v1/profile/email_update/status', {
      expired: false,
      newEmail: '',
      status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
    })
    render(reactQueryProviderHOC(<TrackEmailChange />))

    fireEvent.press(await screen.findByLabelText('Revenir en arrière'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  describe('v2', () => {
    beforeEach(() => useFeatureFlagSpy.mockReturnValueOnce(true))

    describe('account with password', () => {
      it('should render correctly when confirmation step is active', async () => {
        mockServer.getApi<EmailUpdateStatusResponse>('/v2/profile/email_update/status', {
          expired: false,
          newEmail: '',
          status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
          hasRecentlyResetPassword: false,
        })
        render(reactQueryProviderHOC(<TrackEmailChange />))

        await screen.findByText('Confirme ta demande')

        expect(screen).toMatchSnapshot()
      })

      it('should render correctly when choose new email step is active', async () => {
        mockServer.getApi<EmailUpdateStatusResponse>('/v2/profile/email_update/status', {
          expired: false,
          newEmail: '',
          status: EmailHistoryEventTypeEnum.CONFIRMATION,
          hasRecentlyResetPassword: false,
        })
        render(reactQueryProviderHOC(<TrackEmailChange />))

        await screen.findByText('Choisis ta nouvelle adresse e-mail')

        expect(screen).toMatchSnapshot()
      })

      it('should render correctly when validate new email step is active', async () => {
        mockServer.getApi<EmailUpdateStatusResponse>('/v2/profile/email_update/status', {
          expired: false,
          newEmail: 'johndoe@gmail.com',
          status: EmailHistoryEventTypeEnum.NEW_EMAIL_SELECTION,
          hasRecentlyResetPassword: false,
        })
        render(reactQueryProviderHOC(<TrackEmailChange />))

        await screen.findByText('Valide ta nouvelle adresse')

        expect(screen).toMatchSnapshot()
      })
    })
  })
})

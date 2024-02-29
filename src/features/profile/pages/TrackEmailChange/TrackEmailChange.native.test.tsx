import React from 'react'
import { act } from 'react-test-renderer'

import { EmailHistoryEventTypeEnum, EmailUpdateStatus } from 'api/gen'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { TrackEmailChange } from 'features/profile/pages/TrackEmailChange/TrackEmailChange'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen } from 'tests/utils'

const mockUseAuthContext = jest.fn().mockReturnValue({ user: { email: 'example@example.com' } })
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
}))

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

describe('TrackEmailChange', () => {
  it('should render correctly when FF is disabled', async () => {
    mockServer.getApiV1<EmailUpdateStatus>('/profile/email_update/status', {
      expired: false,
      newEmail: '',
      status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
    })
    render(reactQueryProviderHOC(<TrackEmailChange />))

    await act(() => {})

    expect(screen).toMatchSnapshot()
  })

  it('should render correctly when FF is enabled', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)
    render(reactQueryProviderHOC(<TrackEmailChange />))

    await act(() => {})

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to previous screen when clicking on ArrowPrevious icon', async () => {
    mockServer.getApiV1<EmailUpdateStatus>('/profile/email_update/status', {
      expired: false,
      newEmail: '',
      status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
    })
    render(reactQueryProviderHOC(<TrackEmailChange />))

    fireEvent.press(await screen.findByLabelText('Revenir en arrière'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })
})

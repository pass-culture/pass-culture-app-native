import React from 'react'

import { EmailHistoryEventTypeEnum, EmailUpdateStatus } from 'api/gen'
import { ConfirmChangeEmail } from 'features/profile/pages/ConfirmChangeEmail/ConfirmChangeEmail'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.mock('features/identityCheck/context/SubscriptionContextProvider')

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    resetSearch: jest.fn(),
  }),
}))

describe('<ConfirmChangeEmail />', () => {
  it('should render correctly when FF is disabled', () => {
    mockServer.getApi<EmailUpdateStatus>('/v1/profile/email_update/status', {
      expired: false,
      newEmail: '',
      status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
    })
    render(reactQueryProviderHOC(<ConfirmChangeEmail />))

    expect(screen).toMatchSnapshot()
  })

  it('should render correctly when FF is active', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)
    render(reactQueryProviderHOC(<ConfirmChangeEmail />))

    await screen.findByText('Confirmer la demande')

    expect(screen).toMatchSnapshot()
  })
})

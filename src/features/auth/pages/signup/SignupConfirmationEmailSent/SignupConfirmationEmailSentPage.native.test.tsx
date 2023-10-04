import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { SignupConfirmationEmailSentPage } from 'features/auth/pages/signup/SignupConfirmationEmailSent/SignupConfirmationEmailSentPage'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, act } from 'tests/utils'

const navigationProps = {
  route: { params: { email: 'john.doe@gmail.com' } },
} as StackScreenProps<RootStackParamList, 'SignupConfirmationEmailSent'>

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

describe('<SignupConfirmationEmailSentPage />', () => {
  it('should render correctly', async () => {
    mockServer.getAPIV1('/native/v1/email_validation_remaining_resends/john.doe%40gmail.com', {
      remainingResends: 3,
    })
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    render(reactQueryProviderHOC(<SignupConfirmationEmailSentPage {...navigationProps} />))
    await act(async () => {})

    expect(screen).toMatchSnapshot()
  })
})

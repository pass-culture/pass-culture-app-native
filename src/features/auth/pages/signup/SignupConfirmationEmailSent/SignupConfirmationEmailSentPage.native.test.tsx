import { StackScreenProps } from '@react-navigation/stack'
import { rest } from 'msw'
import React from 'react'

import { SignupConfirmationEmailSentPage } from 'features/auth/pages/signup/SignupConfirmationEmailSent/SignupConfirmationEmailSentPage'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { env } from 'libs/environment'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { render, screen, act } from 'tests/utils'

const navigationProps = {
  route: { params: { email: 'john.doe@gmail.com' } },
} as StackScreenProps<RootStackParamList, 'SignupConfirmationEmailSent'>

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

server.use(
  rest.get(
    `${env.API_BASE_URL}/native/v1/email_validation_remaining_resends/john.doe%40gmail.com`,
    (_req, res, ctx) => res(ctx.status(200), ctx.json({ remainingResends: 3 }))
  )
)

describe('<SignupConfirmationEmailSentPage />', () => {
  it('should render correctly', async () => {
    render(reactQueryProviderHOC(<SignupConfirmationEmailSentPage {...navigationProps} />))
    await act(async () => {})

    expect(screen).toMatchSnapshot()
  })
})

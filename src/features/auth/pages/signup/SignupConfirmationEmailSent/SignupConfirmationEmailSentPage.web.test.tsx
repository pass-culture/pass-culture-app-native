import { StackScreenProps } from '@react-navigation/stack'
import { rest } from 'msw'
import React from 'react'

import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { env } from 'libs/environment'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { render, checkAccessibilityFor, act } from 'tests/utils/web'

import { SignupConfirmationEmailSentPage } from './SignupConfirmationEmailSentPage'

const navigationProps = {
  route: { params: { email: 'john.doe@gmail.com' } },
} as StackScreenProps<RootStackParamList, 'SignupConfirmationEmailSent'>

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

describe('<SignupConfirmationEmailSentPage/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      server.use(
        rest.get(
          `${env.API_BASE_URL}/native/v1/email_validation_remaining_resends/john.doe%40gmail.com`,
          (_req, res, ctx) => res(ctx.status(200), ctx.json({ remainingResends: 3 }))
        )
      )
      const { container } = render(
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        reactQueryProviderHOC(<SignupConfirmationEmailSentPage {...navigationProps} />)
      )
      await act(async () => {})

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { EmailValidationRemainingResendsResponse } from 'api/gen'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render } from 'tests/utils/web'

import { SignupConfirmationEmailSentPage } from './SignupConfirmationEmailSentPage'

const navigationProps = {
  route: { params: { email: 'john.doe@gmail.com' } },
} as StackScreenProps<RootStackParamList, 'SignupConfirmationEmailSent'>

jest.mock('libs/firebase/analytics/analytics')

describe('<SignupConfirmationEmailSentPage/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      mockServer.getApi<EmailValidationRemainingResendsResponse>(
        '/v1/email_validation_remaining_resends/john.doe%40gmail.com',
        {
          remainingResends: 3,
        }
      )
      const { container } = render(
        reactQueryProviderHOC(<SignupConfirmationEmailSentPage {...navigationProps} />)
      )
      await act(async () => {})

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

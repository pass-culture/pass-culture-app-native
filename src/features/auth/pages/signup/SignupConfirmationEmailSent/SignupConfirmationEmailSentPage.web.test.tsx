import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'

import { EmailValidationRemainingResendsResponse } from 'api/gen'
import { RootStackParamList } from 'features/navigation/navigators/RootNavigator/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render, waitFor } from 'tests/utils/web'

import { SignupConfirmationEmailSentPage } from './SignupConfirmationEmailSentPage'

const navigationProps = {
  route: { params: { email: 'john.doe@gmail.com' } },
} as NativeStackScreenProps<RootStackParamList, 'SignupConfirmationEmailSent'>

jest.mock('libs/firebase/analytics/analytics')

describe('<SignupConfirmationEmailSentPage/>', () => {
  describe('Accessibility', () => {
    //TODO(PC-36587): unskip this test
    it.skip('should not have basic accessibility issues', async () => {
      mockServer.getApi<EmailValidationRemainingResendsResponse>(
        '/v1/email_validation_remaining_resends/john.doe%40gmail.com',
        {
          remainingResends: 3,
        }
      )
      const { container } = await renderSignupConfirmationEmailSentPage()

      await act(async () => {})

      const results = await checkAccessibilityFor(container)

      await waitFor(() => expect(results).toHaveNoViolations())
    })
  })
})

const renderSignupConfirmationEmailSentPage = async () =>
  act(async () => {
    return render(reactQueryProviderHOC(<SignupConfirmationEmailSentPage {...navigationProps} />))
  })

import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'

import { EmailValidationRemainingResendsResponse } from 'api/gen'
import { SignupConfirmationEmailSentPage } from 'features/auth/pages/signup/SignupConfirmationEmailSent/SignupConfirmationEmailSentPage'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

const navigationProps = {
  route: { params: { email: 'john.doe@gmail.com' } },
} as NativeStackScreenProps<RootStackParamList, 'SignupConfirmationEmailSent'>

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

jest.useFakeTimers()

describe('<SignupConfirmationEmailSentPage />', () => {
  it('should render correctly', async () => {
    mockServer.getApi<EmailValidationRemainingResendsResponse>(
      '/v1/email_validation_remaining_resends/john.doe%40gmail.com',
      {
        remainingResends: 3,
      }
    )
    render(reactQueryProviderHOC(<SignupConfirmationEmailSentPage {...navigationProps} />))
    await screen.findByText('Inscription')

    expect(screen).toMatchSnapshot()
  })
})

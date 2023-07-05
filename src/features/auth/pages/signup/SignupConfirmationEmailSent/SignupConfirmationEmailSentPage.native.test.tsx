import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { SignupConfirmationEmailSentPage } from 'features/auth/pages/signup/SignupConfirmationEmailSent/SignupConfirmationEmailSentPage'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { render, screen } from 'tests/utils'

const navigationProps = {
  route: { params: { email: 'john.doe@gmail.com' } },
} as StackScreenProps<RootStackParamList, 'SignupConfirmationEmailSent'>

describe('<SignupConfirmationEmailSentPage />', () => {
  it('should render correctly', () => {
    render(<SignupConfirmationEmailSentPage {...navigationProps} />)
    expect(screen).toMatchSnapshot()
  })
})

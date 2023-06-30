import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'

import { SignupConfirmationEmailSent } from 'features/auth/pages/signup/SignupConfirmationEmailSent/SignupConfirmationEmailSent'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'

type Props = StackScreenProps<RootStackParamList, 'SignupConfirmationEmailSent'>

export const SignupConfirmationEmailSentPage: FunctionComponent<Props> = ({ route }) => {
  return (
    <SecondaryPageWithBlurHeader headerTitle="Inscription">
      <SignupConfirmationEmailSent email={route.params.email} />
    </SecondaryPageWithBlurHeader>
  )
}

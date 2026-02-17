import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { FunctionComponent } from 'react'

import { SignupConfirmationEmailSent } from 'features/auth/pages/signup/SignupConfirmationEmailSent/SignupConfirmationEmailSent'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { SecondaryPageWithNeutralHeader } from 'ui/pages/SecondaryPageWithNeutralHeader'

type Props = NativeStackScreenProps<RootStackParamList, 'SignupConfirmationEmailSent'>

export const SignupConfirmationEmailSentPage: FunctionComponent<Props> = ({ route }) => {
  return (
    <SecondaryPageWithNeutralHeader title="Inscription">
      <SignupConfirmationEmailSent email={route.params.email} />
    </SecondaryPageWithNeutralHeader>
  )
}

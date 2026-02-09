import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { FunctionComponent } from 'react'

import { SignupConfirmationEmailSent } from 'features/auth/pages/signup/SignupConfirmationEmailSent/SignupConfirmationEmailSent'
import { RootStackParamList } from 'features/navigation/navigators/RootNavigator/types'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'

type Props = NativeStackScreenProps<RootStackParamList, 'SignupConfirmationEmailSent'>

export const SignupConfirmationEmailSentPage: FunctionComponent<Props> = ({ route }) => {
  return (
    <SecondaryPageWithBlurHeader title="Inscription">
      <SignupConfirmationEmailSent email={route.params.email} />
    </SecondaryPageWithBlurHeader>
  )
}

import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { FunctionComponent } from 'react'

import { SignupConfirmationEmailSent } from 'features/auth/pages/signup/SignupConfirmationEmailSent/SignupConfirmationEmailSent'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { PageWithHeader } from 'ui/pages/PageWithHeader'

type Props = NativeStackScreenProps<RootStackParamList, 'SignupConfirmationEmailSent'>

export const SignupConfirmationEmailSentPage: FunctionComponent<Props> = ({ route }) => {
  return (
    <PageWithHeader
      title="Inscription"
      scrollChildren={<SignupConfirmationEmailSent email={route.params.email} />}
    />
  )
}

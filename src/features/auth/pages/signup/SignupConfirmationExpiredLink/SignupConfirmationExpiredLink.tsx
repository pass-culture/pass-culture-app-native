import { useNavigation } from '@react-navigation/native'

import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'

import { useSignupConfirmationExpiredLinkQuery } from 'features/auth/queries/signup/useSignupConfirmationExpiredLinkQuery'
import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { env } from 'libs/environment/env'
import { LayoutExpiredLink } from 'ui/components/LayoutExpiredLink'

type Props = NativeStackScreenProps<RootStackParamList, 'SignupConfirmationExpiredLink'>

export function SignupConfirmationExpiredLink(props: Props) {
  const { navigate } = useNavigation<UseNavigationType>()
  const { email } = props.route.params

  const onSuccess = () => {
    navigate('SignupConfirmationEmailSent', { email })
  }

  const { refetch: signupConfirmationExpiredLinkQuery, isFetching } =
    useSignupConfirmationExpiredLinkQuery(email, onSuccess)

  const renderCustomButton = {
    wording: 'Renvoyer l’email',
    onPress: signupConfirmationExpiredLinkQuery,
    disabled: isFetching,
  }

  return (
    <LayoutExpiredLink
      primaryButtonInformations={renderCustomButton}
      urlFAQ={env.FAQ_LINK_RESET_PASSORD_EMAIL_NOT_RECEIVED}
    />
  )
}

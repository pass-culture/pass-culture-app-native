import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { useQuery } from 'react-query'

import { api } from 'api/api'
import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { AsyncError } from 'libs/monitoring'
import { QueryKeys } from 'libs/queryKeys'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { LayoutExpiredLink } from 'ui/components/LayoutExpiredLink'

type Props = StackScreenProps<RootStackParamList, 'SignupConfirmationExpiredLink'>

export function SignupConfirmationExpiredLink(props: Props) {
  const { navigate } = useNavigation<UseNavigationType>()
  const { email } = props.route.params
  const { refetch: signupConfirmationExpiredLinkQuery, isFetching } = useQuery(
    QueryKeys.SIGNUP_CONFIRMATION_EXPIRED_LINK,
    signupConfirmationExpiredLink,
    {
      cacheTime: 0,
      enabled: false,
    }
  )

  async function signupConfirmationExpiredLink() {
    try {
      analytics.logResendEmailSignupConfirmationExpiredLink()
      await api.postnativev1resendEmailValidation({ email })
      navigate('SignupConfirmationEmailSent', { email })
    } catch (err) {
      throw new AsyncError('NETWORK_REQUEST_FAILED', signupConfirmationExpiredLinkQuery)
    }
  }

  const renderResendEmailButton = () => (
    <ButtonPrimaryWhite
      wording="Renvoyer l’email"
      onPress={signupConfirmationExpiredLinkQuery}
      disabled={isFetching}
    />
  )

  return (
    <LayoutExpiredLink
      renderResendEmailButton={renderResendEmailButton}
      urlFAQ={env.FAQ_LINK_RESET_PASSORD_EMAIL_NOT_RECEIVED}
    />
  )
}

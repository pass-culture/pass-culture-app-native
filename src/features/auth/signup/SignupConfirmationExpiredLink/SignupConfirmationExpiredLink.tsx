import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { useQuery } from 'react-query'

import { api } from 'api/api'
import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { AsyncError } from 'libs/monitoring'
import { QueryKeys } from 'libs/queryKeys'
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

  return (
    <LayoutExpiredLink
      resetQuery={() => signupConfirmationExpiredLinkQuery()}
      isFetching={isFetching}
      urlFAQ="https://aide.passculture.app/fr/articles/5261997-je-n-ai-pas-recu-le-mail-de-confirmation-de-changement-de-mot-de-passe"
      // contactSupport={() => contactSupport.forSignupConfirmationExpiredLink(props.route.params.email)}
    />
  )
}

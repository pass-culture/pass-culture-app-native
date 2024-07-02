import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useCallback } from 'react'
import { useQuery } from 'react-query'

import { api } from 'api/api'
import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { AsyncError } from 'libs/monitoring'
import { LogTypeEnum } from 'libs/monitoring/errors'
import { QueryKeys } from 'libs/queryKeys'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { LayoutExpiredLink } from 'ui/components/LayoutExpiredLink'

type Props = StackScreenProps<RootStackParamList, 'SignupConfirmationExpiredLink'>

export function SignupConfirmationExpiredLink(props: Props) {
  const { navigate } = useNavigation<UseNavigationType>()
  const { email } = props.route.params
  const { refetch: signupConfirmationExpiredLinkQuery, isFetching } = useQuery(
    [QueryKeys.SIGNUP_CONFIRMATION_EXPIRED_LINK],
    signupConfirmationExpiredLink,
    {
      cacheTime: 0,
      enabled: false,
    }
  )

  async function signupConfirmationExpiredLink() {
    try {
      analytics.logResendEmailSignupConfirmationExpiredLink()
      const result = await api.postNativeV1ResendEmailValidation({ email })
      navigate('SignupConfirmationEmailSent', { email })
      return result
    } catch (err) {
      throw new AsyncError('NETWORK_REQUEST_FAILED', {
        retry: signupConfirmationExpiredLinkQuery,
        logType: LogTypeEnum.ERROR,
      })
    }
  }

  const renderResendEmailButton = useCallback(
    () => (
      <ButtonPrimaryWhite
        wording="Renvoyer l’email"
        onPress={signupConfirmationExpiredLinkQuery}
        disabled={isFetching}
      />
    ),
    [isFetching, signupConfirmationExpiredLinkQuery]
  )

  return (
    <LayoutExpiredLink
      renderCustomButton={renderResendEmailButton}
      urlFAQ={env.FAQ_LINK_RESET_PASSORD_EMAIL_NOT_RECEIVED}
    />
  )
}

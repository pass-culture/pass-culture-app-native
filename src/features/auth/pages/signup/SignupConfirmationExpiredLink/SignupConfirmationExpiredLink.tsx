import { useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

import { api } from 'api/api'
import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { AsyncError, LogTypeEnum } from 'libs/monitoring/errors'
import { QueryKeys } from 'libs/queryKeys'
import { LayoutExpiredLink } from 'ui/components/LayoutExpiredLink'

type Props = NativeStackScreenProps<RootStackParamList, 'SignupConfirmationExpiredLink'>

export function SignupConfirmationExpiredLink(props: Props) {
  const { navigate } = useNavigation<UseNavigationType>()
  const { email } = props.route.params

  const signupConfirmationExpiredLink = async () => {
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
  const { refetch: signupConfirmationExpiredLinkQuery, isFetching } = useQuery({
    queryKey: [QueryKeys.SIGNUP_CONFIRMATION_EXPIRED_LINK],
    queryFn: signupConfirmationExpiredLink,
    gcTime: 0,
    enabled: false,
  })

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

import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { AsyncError, LogTypeEnum } from 'libs/monitoring/errors'
import { QueryKeys } from 'libs/queryKeys'
import { LayoutExpiredLink } from 'ui/components/LayoutExpiredLink'

type Props = StackScreenProps<RootStackParamList, 'ResetPasswordExpiredLink'>

export function ResetPasswordExpiredLink(props: Props) {
  const { navigate } = useNavigation<UseNavigationType>()

  const { email } = props.route.params
  const { refetch: resetPasswordEmailQuery, isFetching } = useQuery(
    [QueryKeys.RESET_PASSWORD_EXPIRED_LINK],
    () => {
      analytics.logResendEmailResetPasswordExpiredLink()
      return api.postNativeV1RequestPasswordReset({ email })
    },
    {
      onSuccess: () => {
        navigate('ResetPasswordEmailSent', { email })
      },
      onError: () => {
        throw new AsyncError('NETWORK_REQUEST_FAILED', {
          retry: resetPasswordEmailQuery,
          logType: LogTypeEnum.ERROR,
        })
      },
      cacheTime: 0,
      enabled: false,
    }
  )

  const renderCustomButton = {
    wording: 'Renvoyer l’email',
    onPress: resetPasswordEmailQuery,
    disabled: isFetching,
  }

  return (
    <LayoutExpiredLink
      primaryButtonInformations={renderCustomButton}
      urlFAQ={env.FAQ_LINK_RESET_PASSORD_EMAIL_NOT_RECEIVED}
    />
  )
}

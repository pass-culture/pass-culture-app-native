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

  const renderResendEmailButton = useCallback(
    () => (
      <ButtonPrimaryWhite
        wording="Renvoyer l’email"
        onPress={resetPasswordEmailQuery}
        disabled={isFetching}
      />
    ),
    [isFetching, resetPasswordEmailQuery]
  )

  return (
    <LayoutExpiredLink
      renderCustomButton={renderResendEmailButton}
      urlFAQ={env.FAQ_LINK_RESET_PASSORD_EMAIL_NOT_RECEIVED}
    />
  )
}

import { useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'

import { api } from 'api/api'
import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { AsyncError, LogTypeEnum } from 'libs/monitoring/errors'
import { QueryKeys } from 'libs/queryKeys'
import { LayoutExpiredLink } from 'ui/components/LayoutExpiredLink'

type Props = NativeStackScreenProps<RootStackParamList, 'ResetPasswordExpiredLink'>

export function ResetPasswordExpiredLink(props: Props) {
  const { navigate } = useNavigation<UseNavigationType>()

  const { email } = props.route.params
  const {
    refetch: resetPasswordEmailQuery,
    isFetching,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: [QueryKeys.RESET_PASSWORD_EXPIRED_LINK],

    queryFn: () => {
      analytics.logResendEmailResetPasswordExpiredLink()
      return api.postNativeV1RequestPasswordReset({ email })
    },
    gcTime: 0,
    enabled: false,
    retry: (failureCount) => failureCount <= 1,
  })

  useEffect(() => {
    if (isError)
      throw new AsyncError('NETWORK_REQUEST_FAILED', {
        retry: resetPasswordEmailQuery,
        logType: LogTypeEnum.ERROR,
      })
  }, [isError, resetPasswordEmailQuery])

  useEffect(() => {
    if (isSuccess) navigate('ResetPasswordEmailSent', { email })
  }, [email, isSuccess, navigate])

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

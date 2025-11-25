import { useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect } from 'react'

import { useResetPasswordExpiredLinkQuery } from 'features/auth/queries/useResetPasswordExpiredLinkQuery'
import {
  RootStackParamList,
  UseNavigationType,
} from 'features/navigation/navigators/RootNavigator/types'
import { env } from 'libs/environment/env'
import { AsyncError, LogTypeEnum } from 'libs/monitoring/errors'
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
  } = useResetPasswordExpiredLinkQuery(email)

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

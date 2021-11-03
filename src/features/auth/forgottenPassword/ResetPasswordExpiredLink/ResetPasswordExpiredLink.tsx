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

type Props = StackScreenProps<RootStackParamList, 'ResetPasswordExpiredLink'>

export function ResetPasswordExpiredLink(props: Props) {
  const { navigate } = useNavigation<UseNavigationType>()
  const { refetch: resetPasswordEmailQuery, isFetching } = useQuery(
    QueryKeys.RESET_PASSWORD_EXPIRED_LINK,
    resetPasswordExpiredLink,
    {
      cacheTime: 0,
      enabled: false,
    }
  )

  async function resetPasswordExpiredLink() {
    try {
      const { email } = props.route.params
      analytics.logResendEmailResetPasswordExpiredLink()
      await api.postnativev1requestPasswordReset({ email })
      navigate('ResetPasswordEmailSent', { email })
    } catch (_err) {
      throw new AsyncError('NETWORK_REQUEST_FAILED', resetPasswordEmailQuery)
    }
  }

  return (
    <LayoutExpiredLink
      onResendEmail={() => resetPasswordEmailQuery()}
      disabledResendEmailButton={isFetching}
      urlFAQ="https://aide.passculture.app/fr/articles/5261997-je-n-ai-pas-recu-le-mail-de-confirmation-de-changement-de-mot-de-passe"
    />
  )
}

import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { contactSupport } from 'features/auth/support.services'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { LayoutExpiredLink } from 'ui/components/LayoutExpiredLink'

type Props = StackScreenProps<RootStackParamList, 'ChangeEmailExpiredLink'>

export function ChangeEmailExpiredLink(props: Props) {
  let resendEmailNumberOfHits = 0
  const { email } = props.route.params

  const changeEmailExpiredLink = () => {
    resendEmailNumberOfHits++
    analytics.logSendActivationMailAgain(resendEmailNumberOfHits)
    // TODO (LucasBeneston): try / catch api call like api.postnativev1requestPasswordReset({ email })
  }

  // TODO (LucasBeneston): use isFetching from useQuery()
  const isFetching = false

  return (
    <LayoutExpiredLink
      onResendEmail={changeEmailExpiredLink}
      disabledResendEmailButton={isFetching}
      contactSupport={() => contactSupport.forChangeEmailExpiredLink(email)}
    />
  )
}

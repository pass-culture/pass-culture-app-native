import { t } from '@lingui/macro'
import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { contactSupport } from 'features/auth/support.services'
import { RootStackParamList } from 'features/navigation/RootNavigator'
// import { analytics } from 'libs/analytics'
import { LayoutExpiredLink } from 'ui/components/LayoutExpiredLink'

type Props = StackScreenProps<RootStackParamList, 'ChangeEmailExpiredLink'>

export function ChangeEmailExpiredLink(props: Props) {
  // let resendEmailNumberOfHits = 0
  const { email } = props.route.params

  // const changeEmailExpiredLink = () => {
  //   resendEmailNumberOfHits++
  //   analytics.logSendActivationMailAgain(resendEmailNumberOfHits)
  // TODO (PC-11697): try / catch api call like api.postnativev1requestPasswordReset({ email })
  // }

  const bodyText = !email
    ? t`Tu peux te connecter sur ton profil pour recommencer le parcours de changement d’e-mail.` +
      '\n' +
      '\n' +
      t`Si tu as besoin d’aide, n’hésite pas à contacter le support.`
    : undefined

  // TODO (LucasBeneston): use isFetching from useQuery()
  const isFetching = false

  return (
    <LayoutExpiredLink
      // TODO (PC-11697): uncomment when the resend email feature is available
      // onResendEmail={changeEmailExpiredLink}
      disabledResendEmailButton={isFetching}
      customBodyText={bodyText}
      contactSupport={email ? () => contactSupport.forChangeEmailExpiredLink(email) : undefined}
    />
  )
}

import React, { FunctionComponent } from 'react'

import { EmailSentGeneric } from 'features/auth/components/EmailSentGeneric'
import { contactSupport } from 'features/auth/helpers/contactSupport'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Again } from 'ui/svg/icons/Again'

export type Props = {
  email: string
}

export const SignupConfirmationEmailSent: FunctionComponent<Props> = ({ email }) => {
  const isEmailValidationResendEnabled = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_ENABLE_EMAIL_VALIDATION_RESEND
  )

  const additionalCTA = isEmailValidationResendEnabled ? (
    <ButtonTertiaryBlack
      wording="Recevoir un nouveau lien"
      justifyContent="flex-start"
      icon={Again}
    />
  ) : null

  return (
    <EmailSentGeneric
      title="Confirme ton adresse e-mail"
      email={email}
      consultFaq={contactSupport.forSignupConfirmationEmailNotReceived}
      consultFaqAnalytics={analytics.logHelpCenterContactSignupConfirmationEmailSent}
      openInBoxAnalytics={analytics.logEmailConfirmationConsultEmailClicked}
      additionalCTA={additionalCTA}
    />
  )
}

import React, { FunctionComponent } from 'react'

import { EmailSentGeneric } from 'features/auth/components/EmailSentGeneric'
import { contactSupport } from 'features/auth/helpers/contactSupport'
import { EmailResendModal } from 'features/auth/pages/signup/SignupConfirmationEmailSent/EmailResendModal'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { useModal } from 'ui/components/modals/useModal'
import { Again } from 'ui/svg/icons/Again'

export type Props = {
  email: string
}

export const SignupConfirmationEmailSent: FunctionComponent<Props> = ({ email }) => {
  const isEmailValidationResendEnabled = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_ENABLE_EMAIL_VALIDATION_RESEND
  )
  const { visible, showModal, hideModal } = useModal()

  const additionalCTA = isEmailValidationResendEnabled ? (
    <ButtonTertiaryBlack
      wording="Recevoir un nouveau lien"
      justifyContent="flex-start"
      onPress={showModal}
      icon={Again}
    />
  ) : null

  return (
    <React.Fragment>
      <EmailSentGeneric
        title="Confirme ton adresse e-mail"
        email={email}
        consultFaq={contactSupport.forSignupConfirmationEmailNotReceived}
        consultFaqAnalytics={analytics.logHelpCenterContactSignupConfirmationEmailSent}
        openInBoxAnalytics={analytics.logEmailConfirmationConsultEmailClicked}
        additionalCTA={additionalCTA}
      />
      <EmailResendModal visible={visible} onDismiss={hideModal} />
    </React.Fragment>
  )
}

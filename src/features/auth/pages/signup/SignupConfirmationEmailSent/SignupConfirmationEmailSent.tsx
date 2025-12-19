import React, { FunctionComponent } from 'react'

import { EmailSentGeneric } from 'features/auth/components/EmailSentGeneric'
import { EmailResendModal } from 'features/auth/pages/signup/SignupConfirmationEmailSent/EmailResendModal'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { useModal } from 'ui/components/modals/useModal'
import { Again } from 'ui/svg/icons/Again'

export type Props = {
  email: string
}

export const faqConfig = {
  url: env.FAQ_LINK_SIGNUP_CONFIRMATION_EMAIL_NOT_RECEIVED,
  params: { shouldLogEvent: false },
}

export const SignupConfirmationEmailSent: FunctionComponent<Props> = ({ email }) => {
  const { visible, showModal, hideModal } = useModal()

  const additionalCTA = (
    <ButtonTertiaryBlack
      accessibilityRole={AccessibilityRole.BUTTON}
      wording="Recevoir un nouveau lien"
      justifyContent="flex-start"
      onPress={showModal}
      icon={Again}
    />
  )

  return (
    <React.Fragment>
      <EmailSentGeneric
        title="Confirme ton adresse e-mail"
        email={email}
        consultFaq={faqConfig}
        consultFaqAnalytics={analytics.logHelpCenterContactSignupConfirmationEmailSent}
        additionalCTA={additionalCTA}
      />
      <EmailResendModal email={email} visible={visible} onDismiss={hideModal} />
    </React.Fragment>
  )
}

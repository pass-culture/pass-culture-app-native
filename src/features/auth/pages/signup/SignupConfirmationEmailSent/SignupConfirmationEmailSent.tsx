import React, { FunctionComponent } from 'react'

import { EmailSentGeneric } from 'features/auth/components/EmailSentGeneric'
import { contactSupport } from 'features/auth/helpers/contactSupport'
import { analytics } from 'libs/analytics'

export type Props = {
  email: string
}

export const SignupConfirmationEmailSent: FunctionComponent<Props> = ({ email }) => (
  <EmailSentGeneric
    title="Confirme ton adresse e-mail"
    email={email}
    consultFaq={contactSupport.forSignupConfirmationEmailNotReceived}
    consultFaqAnalytics={analytics.logHelpCenterContactSignupConfirmationEmailSent}
    openInBoxAnalytics={analytics.logEmailConfirmationConsultEmailClicked}
  />
)

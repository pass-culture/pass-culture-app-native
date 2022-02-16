import { openUrl } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { eventMonitoring } from 'libs/monitoring'

class ContactSupportError extends Error {
  name = 'ContactSupportError'
  constructor(public message: string) {
    super(message)
  }
}

const subject = encodeURI('Confirmation de numéro de téléphone')
export const supportUrl = {
  forGenericQuestion: `mailto:${env.SUPPORT_EMAIL_ADDRESS}`,
  forSignupConfirmationEmailNotReceived: env.FAQ_LINK_SIGNUP_CONFIRMATION_EMAIL_NOT_RECEIVED,
  forPhoneNumberConfirmation: `mailto:${env.SUPPORT_EMAIL_ADDRESS}?subject=${subject}`,
}

export const contactSupport = {
  forGenericQuestion() {
    openUrl(supportUrl.forGenericQuestion, { shouldLogEvent: false })
      .then(() => analytics.logMailTo('forGenericQuestion'))
      .catch(() => eventMonitoring.captureException(new ContactSupportError('GenericQuestion')))
  },
  forSignupConfirmationEmailNotReceived() {
    openUrl(supportUrl.forSignupConfirmationEmailNotReceived, { shouldLogEvent: false })
      .then(() => analytics.logMailTo('forSignupConfirmationEmailNotReceived'))
      .catch(() =>
        eventMonitoring.captureException(
          new ContactSupportError('SignupConfirmationEmailNotReceived')
        )
      )
  },
  forPhoneNumberConfirmation() {
    openUrl(supportUrl.forPhoneNumberConfirmation, { shouldLogEvent: false })
      .then(() => analytics.logMailTo('forPhoneNumberConfirmation'))
      .catch(() =>
        eventMonitoring.captureException(new ContactSupportError('PhoneNumberConfirmation'))
      )
  },
}

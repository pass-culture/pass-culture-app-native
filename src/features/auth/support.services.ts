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

export const contactSupport = {
  forGenericQuestion() {
    openUrl(`mailto:${env.SUPPORT_EMAIL_ADDRESS}`, { shouldLogEvent: false })
      .then(() => analytics.logMailTo('forGenericQuestion'))
      .catch(() => eventMonitoring.captureException(new ContactSupportError('GenericQuestion')))
  },
  forSignupConfirmationEmailNotReceived() {
    openUrl(env.FAQ_LINK_SIGNUP_CONFIRMATION_EMAIL_NOT_RECEIVED, { shouldLogEvent: false })
      .then(() => analytics.logMailTo('forSignupConfirmationEmailNotReceived'))
      .catch(() =>
        eventMonitoring.captureException(
          new ContactSupportError('SignupConfirmationEmailNotReceived')
        )
      )
  },
  forPhoneNumberConfirmation() {
    const subject = encodeURI('Confirmation de numéro de téléphone')
    openUrl(`mailto:${env.SUPPORT_EMAIL_ADDRESS}?subject=${subject}`, { shouldLogEvent: false })
      .then(() => analytics.logMailTo('forPhoneNumberConfirmation'))
      .catch(() =>
        eventMonitoring.captureException(new ContactSupportError('PhoneNumberConfirmation'))
      )
  },
}

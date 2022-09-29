import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { eventMonitoring } from 'libs/monitoring'
import { ExternalNavigationProps } from 'ui/components/touchableLink/types'

class ContactSupportError extends Error {
  name = 'ContactSupportError'
  constructor(public message: string) {
    super(message)
  }
}

const subject = encodeURI('Confirmation de numéro de téléphone')

export const contactSupport: Record<string, ExternalNavigationProps['externalNav']> = {
  forGenericQuestion: {
    url: `mailto:${env.SUPPORT_EMAIL_ADDRESS}`,
    params: { shouldLogEvent: false },
    onSuccess: () => analytics.logMailTo('forGenericQuestion'),
    onError: () => eventMonitoring.captureException(new ContactSupportError('GenericQuestion')),
  },
  forSignupConfirmationEmailNotReceived: {
    url: env.FAQ_LINK_SIGNUP_CONFIRMATION_EMAIL_NOT_RECEIVED,
    params: { shouldLogEvent: false },
    onSuccess: () => analytics.logMailTo('forSignupConfirmationEmailNotReceived'),
    onError: () =>
      eventMonitoring.captureException(
        new ContactSupportError('SignupConfirmationEmailNotReceived')
      ),
  },
  forPhoneNumberConfirmation: {
    url: `mailto:${env.SUPPORT_EMAIL_ADDRESS}?subject=${subject}`,
    params: { shouldLogEvent: false },
    onSuccess: () => analytics.logMailTo('forPhoneNumberConfirmation'),
    onError: () =>
      eventMonitoring.captureException(new ContactSupportError('PhoneNumberConfirmation')),
  },
}

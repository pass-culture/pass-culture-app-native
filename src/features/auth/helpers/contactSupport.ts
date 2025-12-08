import { ContactSupport } from 'features/auth/types'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { eventMonitoring } from 'libs/monitoring/services'

class ContactSupportError extends Error {
  name = 'ContactSupportError'
  constructor(public message: string) {
    super(message)
  }
}

export const contactSupport = {
  forSignupConfirmationEmailNotReceived: {
    url: env.FAQ_LINK_SIGNUP_CONFIRMATION_EMAIL_NOT_RECEIVED,
    params: { shouldLogEvent: false },
    onSuccess: () => analytics.logMailTo('forSignupConfirmationEmailNotReceived'),
    onError: () =>
      eventMonitoring.captureException(
        new ContactSupportError('SignupConfirmationEmailNotReceived')
      ),
  },
} as const satisfies ContactSupport

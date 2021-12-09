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
  forChangeEmailExpiredLink(email: string) {
    const subject = encodeURI("Demande de renvoi du mail d'activation de changement d'e-mail")
    const body = encodeURI(
      'Bonjour, \n' +
        '\n' +
        `Je vous écris afin de vous informer de l'expiration du lien de changement d'e-mail associé à l'adresse e-mail ${email}. \n` +
        '\n' +
        'Bien cordialement,'
    )
    openUrl(`mailto:${env.SUPPORT_EMAIL_ADDRESS}?subject=${subject}&body=${body}`, {
      shouldLogEvent: false,
    })
      .then(() => analytics.logMailTo('forChangeEmailExpiredLink'))
      .catch(() =>
        eventMonitoring.captureException(new ContactSupportError('ChangeEmailExpiredLink'))
      )
  },
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
  forSignupConfirmationExpiredLink(email: string) {
    const subject = encodeURI('Lien de confirmation de compte expiré')
    const body = encodeURI(
      'Bonjour, \n' +
        '\n' +
        `Je vous écris afin de vous informer de l'expiration du lien de confirmation de compte associé à l'adresse e-mail ${email}. \n` +
        '\n' +
        'Bien cordialement,'
    )
    openUrl(`mailto:${env.SUPPORT_EMAIL_ADDRESS}?subject=${subject}&body=${body}`, {
      shouldLogEvent: false,
    })
      .then(() => analytics.logMailTo('forSignupConfirmationExpiredLink'))
      .catch(() =>
        eventMonitoring.captureException(new ContactSupportError('SignupConfirmationExpiredLink'))
      )
  },
  forResetPasswordEmailNotReceived(email: string) {
    const subject = encodeURI("Non réception d'email de réinitialisation de mot de passe")
    const body = encodeURI(
      'Bonjour, \n' +
        '\n' +
        `Je vous écris afin de vous informer de la non réception de l'email de réinitialisation de mot de passe associé à l'adresse e-mail ${email}, y compris dans mes spams. \n` +
        '\n' +
        'Bien cordialement,'
    )
    openUrl(`mailto:${env.SUPPORT_EMAIL_ADDRESS}?subject=${subject}&body=${body}`, {
      shouldLogEvent: false,
    })
      .then(() => analytics.logMailTo('forResetPasswordEmailNotReceived'))
      .catch(() =>
        eventMonitoring.captureException(new ContactSupportError('ResetPasswordEmailNotReceived'))
      )
  },
  forResetPasswordExpiredLink(email: string) {
    const subject = encodeURI('Lien de réinitialisation de mot de passe expiré')
    const body = encodeURI(
      'Bonjour, \n' +
        '\n' +
        `Je vous écris afin de vous informer de l'expiration du lien de réinitialisation de mot de passe associé à l'adresse e-mail ${email}. \n` +
        '\n' +
        'Bien cordialement,'
    )
    openUrl(`mailto:${env.SUPPORT_EMAIL_ADDRESS}?subject=${subject}&body=${body}`, {
      shouldLogEvent: false,
    })
      .then(() => analytics.logMailTo('forResetPasswordExpiredLink'))
      .catch(() =>
        eventMonitoring.captureException(new ContactSupportError('ResetPasswordExpiredLink'))
      )
  },
  forAccountDeletion(email: string) {
    const subject = encodeURI('Suppression de mon compte pass Culture')
    const body = encodeURI(
      'Bonjour, \n' +
        '\n' +
        `Je vous écris afin de vous demander la suppression de mon compte pass Culture associé à l'adresse e-mail ${email}. \n` +
        '\n' +
        `J'ai conscience que la suppression de mon compte entraînera l'annulation définitive de l'ensemble de mes réservations en cours. \n` +
        '\n' +
        `J'ai 20jours pour me rétracter. Au-delà de ce délai, je ne pourrai plus accéder à mon compte pass Culture, ni au crédit éventuellement restant. \n` +
        '\n' +
        'Bien cordialement,'
    )
    openUrl(`mailto:${env.SUPPORT_EMAIL_ADDRESS}?subject=${subject}&body=${body}`, {
      shouldLogEvent: false,
    })
      .then(() => analytics.logMailTo('forAccountDeletion'))
      .catch(() => eventMonitoring.captureException(new ContactSupportError('AccountDeletion')))
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

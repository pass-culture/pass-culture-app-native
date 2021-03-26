import { openExternalUrl } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'

export const contactSupport = {
  forGenericQuestion() {
    openExternalUrl(`mailto:${env.SUPPORT_EMAIL_ADDRESS}`, false).then(() =>
      analytics.logMailTo('forGenericQuestion')
    )
  },
  forSignupConfirmationEmailNotReceived(email: string) {
    openExternalUrl(
      `mailto:${env.SUPPORT_EMAIL_ADDRESS}?subject=Non-r%C3%A9ception%20d'email%20de%20confirmation%20de%20compte&body=Bonjour%2C%0D%0A%0D%0AJe%20vous%20%C3%A9cris%20afin%20de%20vous%20informer%20de%20la%20non-r%C3%A9ception%20de%20l'email%20de%20confirmation%20de%20compte%20associ%C3%A9%20%C3%A0%20l%E2%80%99adresse%20e-mail%20${email}%2C%20y%20compris%20dans%20mes%20spams.%0D%0A%0D%0ABien%20cordialement%2C`,
      false
    ).then(() => analytics.logMailTo('forSignupConfirmationEmailNotReceived'))
  },
  forSignupConfirmationExpiredLink(email: string) {
    openExternalUrl(
      `mailto:${env.SUPPORT_EMAIL_ADDRESS}?subject=Lien%20de%20confirmation%20de%20compte%20expir%C3%A9&body=Bonjour%2C%0D%0A%0D%0AJe%20vous%20%C3%A9cris%20afin%20de%20vous%20informer%20de%20l'expiration%20du%20lien%20de%20confirmation%20de%20compte%20associ%C3%A9%20%C3%A0%20l%E2%80%99adresse%20e-mail%20${email}.%0D%0A%0D%0ABien%20cordialement%2C`,
      false
    ).then(() => analytics.logMailTo('forSignupConfirmationExpiredLink'))
  },
  forResetPasswordEmailNotReceived(email: string) {
    openExternalUrl(
      `mailto:${env.SUPPORT_EMAIL_ADDRESS}?subject=Non-r%C3%A9ception%20d'email%20de%20r%C3%A9initialisation%20de%20mot%20de%20passe&body=Bonjour%2C%0D%0A%0D%0AJe%20vous%20%C3%A9cris%20afin%20de%20vous%20informer%20de%20la%20non-r%C3%A9ception%20de%20l'email%20de%20r%C3%A9initialisation%20de%20mot%20de%20passe%20associ%C3%A9%20%C3%A0%20l%E2%80%99adresse%20e-mail%20${email}%2C%20y%20compris%20dans%20mes%20spams.%0D%0A%0D%0ABien%20cordialement%2C`,
      false
    ).then(() => analytics.logMailTo('forResetPasswordEmailNotReceived'))
  },
  forResetPasswordExpiredLink(email: string) {
    openExternalUrl(
      `mailto:${env.SUPPORT_EMAIL_ADDRESS}?subject=Lien%20de%20r%C3%A9initialisation%20de%20mot%20de%20passe%20expir%C3%A9&body=Bonjour%2C%0D%0A%0D%0AJe%20vous%20%C3%A9cris%20afin%20de%20vous%20informer%20de%20l'expiration%20du%20lien%20de%20r%C3%A9initialisation%20de%20mot%20de%20passe%20associ%C3%A9%20%C3%A0%20l%E2%80%99adresse%20e-mail%20${email}.%0D%0A%0D%0ABien%20cordialement%2C`,
      false
    ).then(() => analytics.logMailTo('forResetPasswordExpiredLink'))
  },
  forAccountDeletion(email: string) {
    openExternalUrl(
      `mailto:${env.SUPPORT_EMAIL_ADDRESS}?subject=Suppression%20de%20mon%20compte%20pass%20Culture&body=Bonjour%2C%0D%0A%0D%0AJe%20vous%20%C3%A9cris%20afin%20de%20vous%20demander%20la%20suppression%20de%20mon%20compte%20pass%20Culture%20associ%C3%A9%20%C3%A0%20l%E2%80%99adresse%20e-mail%20${email}.%20%0D%0A%0D%0AJ%27ai%20conscience%20que%20la%20suppression%20de%20mon%20compte%20entra%C3%AEnera%20l%27annulation%20d%C3%A9finitive%20de%20l%27ensemble%20de%20mes%20r%C3%A9servations%20en%20cours.%0D%0A%0D%0AJ%27ai%2030%20jours%20pour%20me%20r%C3%A9tracter.%20Au-del%C3%A0%20de%20ce%20d%C3%A9lai%2C%20je%20ne%20pourrai%20plus%20acc%C3%A9der%20%C3%A0%20mon%20compte%20pass%20Culture%2C%20ni%20au%20cr%C3%A9dit%20%C3%A9ventuellement%20restant.%0D%0A%0D%0ABien%20cordialement%2C`,
      false
    ).then(() => analytics.logMailTo('forAccountDeletion'))
  },
}

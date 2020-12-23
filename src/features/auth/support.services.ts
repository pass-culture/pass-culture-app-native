import { openExternalUrl } from 'features/navigation/helpers'
import { env } from 'libs/environment'

export const contactSupport = {
  forGenericQuestion() {
    openExternalUrl(`mailto:${env.SUPPORT_EMAIL_ADDRESS}`)
  },
  forSignupConfirmationEmailNotReceived(email: string) {
    openExternalUrl(
      `mailto:${env.SUPPORT_EMAIL_ADDRESS}?subject=Non-r%C3%A9ception%20d'email%20de%20confirmation%20de%20compte&body=Bonjour%2C%0D%0A%0D%0AJe%20vous%20%C3%A9cris%20afin%20de%20vous%20informer%20de%20la%20non-r%C3%A9ception%20de%20l'email%20de%20confirmation%20de%20compte%20associ%C3%A9%20%C3%A0%20l%E2%80%99adresse%20e-mail%20${email}%2C%20y%20compris%20dans%20mes%20spams.%0D%0A%0D%0ABien%20cordialement%2C`
    )
  },
  forSignupConfirmationExpiredLink(email: string) {
    openExternalUrl(
      `mailto:${env.SUPPORT_EMAIL_ADDRESS}?subject=Lien%20de%20confirmation%20de%20compte%20expir%C3%A9&body=Bonjour%2C%0D%0A%0D%0AJe%20vous%20%C3%A9cris%20afin%20de%20vous%20informer%20de%20l'expiration%20du%20lien%20de%20confirmation%20de%20compte%20associ%C3%A9%20%C3%A0%20l%E2%80%99adresse%20e-mail%20${email}.%0D%0A%0D%0ABien%20cordialement%2C`
    )
  },
  forResetPasswordEmailNotReceived(email: string) {
    openExternalUrl(
      `mailto:${env.SUPPORT_EMAIL_ADDRESS}?subject=Non-r%C3%A9ception%20d'email%20de%20r%C3%A9initialisation%20de%20mot%20de%20passe&body=Bonjour%2C%0D%0A%0D%0AJe%20vous%20%C3%A9cris%20afin%20de%20vous%20informer%20de%20la%20non-r%C3%A9ception%20de%20l'email%20de%20r%C3%A9initialisation%20de%20mot%20de%20passe%20associ%C3%A9%20%C3%A0%20l%E2%80%99adresse%20e-mail%20${email}%2C%20y%20compris%20dans%20mes%20spams.%0D%0A%0D%0ABien%20cordialement%2C`
    )
  },
  forResetPasswordExpiredLink(email: string) {
    openExternalUrl(
      `mailto:${env.SUPPORT_EMAIL_ADDRESS}?subject=Lien%20de%20r%C3%A9initialisation%20de%20mot%20de%20passe%20expir%C3%A9&body=Bonjour%2C%0D%0A%0D%0AJe%20vous%20%C3%A9cris%20afin%20de%20vous%20informer%20de%20l'expiration%20du%20lien%20de%20r%C3%A9initialisation%20de%20mot%20de%20passe%20associ%C3%A9%20%C3%A0%20l%E2%80%99adresse%20e-mail%20${email}.%0D%0A%0D%0ABien%20cordialement%2C`
    )
  },
}

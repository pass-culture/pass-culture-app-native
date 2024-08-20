import { EmailProvider } from './useContactSupportForDeletionProfile'

export const webEmailProvider = (): EmailProvider => {
  return {
    requestSendEmail: async ({ to, subject, body }) => {
      let mailtoLink = `mailto:${to}?subject=${subject}`

      if (body) {
        mailtoLink += `&body=${body}`
      }

      window.location.href = mailtoLink
    },
  }
}

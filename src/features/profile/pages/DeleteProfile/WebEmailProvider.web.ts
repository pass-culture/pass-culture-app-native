import { EmailProvider } from './useContactSupportForDeletionProfile'

export const webEmailProvider = (): EmailProvider => {
  return {
    requestSendEmail: async ({ to, subject, body }) => {
      window.location.href = `mailto:${to}?subject=${subject}&body=${String(body)}`
    },
  }
}

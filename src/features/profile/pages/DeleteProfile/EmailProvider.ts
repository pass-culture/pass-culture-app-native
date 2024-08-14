import { openComposer } from 'react-native-email-link'

import { EmailProvider } from './useContactSupportForDeletionProfile'

export const nativeEmailProvider = (): EmailProvider => {
  return {
    requestSendEmail: async (options) => {
      await openComposer({
        to: options.to,
        subject: options.subject,
        body: options.body,
      })
    },
  }
}

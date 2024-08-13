export type EmailProvider = {
  requestSendEmail: (options: { to: string; subject: string; body?: string }) => Promise<void>
}

export const useContactSupportForDeletionProfile = ({
  emailProvider,
}: {
  emailProvider: EmailProvider
}) => {
  const requestSendMail = async () => {
    return emailProvider.requestSendEmail({
      to: 'contact@passculture.com',
      subject: 'Suppression de mon compte',
    })
  }

  return { requestSendMail }
}

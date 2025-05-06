import {
  EmailProvider,
  getContactSupportForDeletionProfile,
} from './getContactSupportForDeletionProfile'

type StubEmailProvider = ReturnType<typeof stubEmailProvider>
const stubEmailProvider = () => {
  let lastRequestedEmailSent: { to: string; subject: string; body?: string }
  return {
    requestSendEmail: async (option) => {
      lastRequestedEmailSent = option
    },
    lastRequestedEmailSent: () => lastRequestedEmailSent,
  } satisfies EmailProvider & { [key: string]: unknown }
}

describe('Get contact support for deletion profile', () => {
  let emailProvider: StubEmailProvider

  beforeEach(() => {
    emailProvider = stubEmailProvider()
  })

  it('Should request sending mail with object and recipient', async () => {
    const { requestSendMail } = getContactSupportForDeletionProfile({ emailProvider })

    await requestSendMail()

    expect(emailProvider.lastRequestedEmailSent()).toEqual({
      to: 'contact@passculture.com',
      subject: 'Suppression de mon compte',
    })
  })
})

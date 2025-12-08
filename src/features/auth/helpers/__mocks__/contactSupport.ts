import { ContactSupport } from 'features/auth/types'

export const contactSupport = {
  forSignupConfirmationEmailNotReceived: {
    url: '',
    params: { shouldLogEvent: false },
    onSuccess: jest.fn(),
    onError: jest.fn(),
  },
} as const satisfies ContactSupport

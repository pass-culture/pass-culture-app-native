import { ContactSupport } from 'features/auth/types'

export const contactSupport = {
  forGenericQuestion: {
    url: '',
    params: { shouldLogEvent: false },
    onSuccess: jest.fn(),
    onError: jest.fn(),
  },
  forSignupConfirmationEmailNotReceived: {
    url: '',
    params: { shouldLogEvent: false },
    onSuccess: jest.fn(),
    onError: jest.fn(),
  },
  forPhoneNumberConfirmation: {
    url: '',
    params: { shouldLogEvent: false },
    onSuccess: jest.fn(),
    onError: jest.fn(),
  },
} as const satisfies ContactSupport

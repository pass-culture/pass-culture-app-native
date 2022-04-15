import { contactSupport as actualContactSupport } from '../support.services'

export const contactSupport: typeof actualContactSupport = {
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
}

import { contactSupport as actualContactSupport } from '../support.services'

export const contactSupport: typeof actualContactSupport = {
  forGenericQuestion: jest.fn(),
  forSignupConfirmationEmailNotReceived: jest.fn(),
  forPhoneNumberConfirmation: jest.fn(),
}

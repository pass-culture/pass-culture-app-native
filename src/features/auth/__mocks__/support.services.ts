import { contactSupport as actualContactSupport } from '../support.services'

export const contactSupport: typeof actualContactSupport = {
  forGenericQuestion: jest.fn(),
  forSignupConfirmationEmailNotReceived: jest.fn(),
  forSignupConfirmationExpiredLink: jest.fn(),
  forResetPasswordEmailNotReceived: jest.fn(),
  forResetPasswordExpiredLink: jest.fn(),
}

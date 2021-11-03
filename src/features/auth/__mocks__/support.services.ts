import { contactSupport as actualContactSupport } from '../support.services'

export const contactSupport: typeof actualContactSupport = {
  forChangeEmailExpiredLink: jest.fn(),
  forGenericQuestion: jest.fn(),
  forSignupConfirmationEmailNotReceived: jest.fn(),
  forSignupConfirmationExpiredLink: jest.fn(),
  forResetPasswordEmailNotReceived: jest.fn(),
  forResetPasswordExpiredLink: jest.fn(),
  forAccountDeletion: jest.fn(),
  forPhoneNumberConfirmation: jest.fn(),
}

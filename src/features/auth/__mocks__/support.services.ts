import {
  contactSupport as actualContactSupport,
  supportUrl as actualSupportUrl,
} from '../support.services'

export const supportUrl: typeof actualSupportUrl = {
  forGenericQuestion: '',
  forSignupConfirmationEmailNotReceived: '',
  forPhoneNumberConfirmation: '',
}
export const contactSupport: typeof actualContactSupport = {
  forGenericQuestion: jest.fn(),
  forSignupConfirmationEmailNotReceived: jest.fn(),
  forPhoneNumberConfirmation: jest.fn(),
}

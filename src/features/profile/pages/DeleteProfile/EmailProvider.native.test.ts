import { openComposer } from 'react-native-email-link'

import { nativeEmailProvider } from './EmailProvider'

jest.mock('react-native-email-link', () => ({
  openComposer: jest.fn(),
}))

describe('EmailProvider native', () => {
  describe('requestSendEmail', () => {
    it('Should request sending mail with options', async () => {
      const emailProvider = nativeEmailProvider()
      emailProvider.requestSendEmail({
        to: 'test@test.com',
        subject: 'Subject',
        body: 'Body',
      })

      expect(openComposer).toHaveBeenCalledWith({
        to: 'test@test.com',
        subject: 'Subject',
        body: 'Body',
      })
    })
  })
})

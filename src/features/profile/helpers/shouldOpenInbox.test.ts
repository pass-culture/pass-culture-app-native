import { isAppUrl } from 'features/navigation/helpers'

import { shouldOpenInbox } from './shouldOpenInbox'

jest.mock('features/navigation/helpers')

describe('shouldOpenInbox', () => {
  it("should return true if url is appUrl and contains 'openInbox' string ", () => {
    const link = 'prefix' + 'openInbox'
    expect(shouldOpenInbox(link)).toBeTruthy()
  })
  it('should return false if url is appUrl and does not contain openInbox', () => {
    const link = 'prefix' + 'whatever'
    expect(shouldOpenInbox(link)).toBeFalsy()
  })
  it('should return false if url is not appUrl and contains openInbox', () => {
    const isAppUrlMock = isAppUrl as jest.Mock
    isAppUrlMock.mockReturnValueOnce(false)
    const link = 'https://whateveropenInbox.com'
    expect(shouldOpenInbox(link)).toBeFalsy()
  })
})

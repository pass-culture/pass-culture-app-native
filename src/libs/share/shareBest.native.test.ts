import { Platform, Share } from 'react-native'
import SocialShare from 'react-native-share'

import { share } from 'libs/share/shareBest'
import { waitFor } from 'tests/utils'

const mockShareSingle = jest.spyOn(SocialShare, 'shareSingle')

const shareMockReturnValue = { action: Share.sharedAction, activityType: 'copy' }
const shareMock = jest.spyOn(Share, 'share').mockResolvedValue(shareMockReturnValue)

const defaultContent = { body: 'Message', url: 'https://www.toto.com' }

describe('share()', () => {
  describe('on Android', () => {
    beforeEach(() => {
      Platform.OS = 'android'
    })

    it('should share with native dialog when default mode', () => {
      share({ content: defaultContent, mode: 'default' })

      expect(shareMock).toHaveBeenCalledWith({ message: 'Message :\nhttps://www.toto.com' }, {})
    })

    it('should share with a title in the native dialog when default mode and title provided', () => {
      share({ content: { ...defaultContent, subject: 'title' }, mode: 'default' })

      expect(shareMock).toHaveBeenCalledWith(
        { message: 'Message :\nhttps://www.toto.com', title: 'title' },
        {
          dialogTitle: 'title',
        }
      )
    })
  })

  describe('on iOS', () => {
    beforeEach(() => {
      Platform.OS = 'ios'
    })

    it('should share with native dialog when default mode', () => {
      share({ content: defaultContent, mode: 'default' })

      expect(shareMock).toHaveBeenCalledWith(
        { message: 'Message :\n', url: 'https://www.toto.com' },
        {}
      )
    })

    it('should share with a title in the native dialog when default mode and title provided', () => {
      share({ content: { ...defaultContent, subject: 'title' }, mode: 'default' })

      expect(shareMock).toHaveBeenCalledWith(
        { message: 'Message :\n', url: 'https://www.toto.com' },
        {
          subject: 'title',
        }
      )
    })
  })

  it('should log analytics when a tracker is provided', async () => {
    const logAnalytics = jest.fn()
    share({ content: defaultContent, mode: 'default', logAnalyticsEvent: logAnalytics })

    await waitFor(() => {
      expect(logAnalytics).toHaveBeenCalledTimes(1)
    })
  })
})

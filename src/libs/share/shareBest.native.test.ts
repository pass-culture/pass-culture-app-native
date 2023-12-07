import { Platform, Share, Linking } from 'react-native'
import SocialShare, { Social } from 'react-native-share'

import { share } from 'libs/share/shareBest'
import { Network } from 'ui/components/ShareMessagingApp'

const mockOpenUrl = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined)

const mockShareSingle = jest.spyOn(SocialShare, 'shareSingle')

const shareMockReturnValue = { action: Share.sharedAction, activityType: 'copy' }
const shareMock = jest.spyOn(Share, 'share').mockResolvedValue(shareMockReturnValue)

const defaultContent = { body: 'Message', url: 'https://www.toto.com' }

describe('share()', () => {
  describe('on Android', () => {
    beforeEach(() => {
      Platform.OS = 'android'
    })

    it('should share with native dialog when default mode', async () => {
      await share({ content: defaultContent, mode: 'default' })

      expect(shareMock).toHaveBeenCalledWith({ message: 'Message :\nhttps://www.toto.com' }, {})
    })

    it('should share with a title in the native dialog when default mode and title provided', async () => {
      await share({ content: { ...defaultContent, subject: 'title' }, mode: 'default' })

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

    it('should share with native dialog when default mode', async () => {
      await share({ content: defaultContent, mode: 'default' })

      expect(shareMock).toHaveBeenCalledWith(
        { message: 'Message :\n', url: 'https://www.toto.com' },
        {}
      )
    })

    it('should share with a title in the native dialog when default mode and title provided', async () => {
      await share({ content: { ...defaultContent, subject: 'title' }, mode: 'default' })

      expect(shareMock).toHaveBeenCalledWith(
        { message: 'Message :\n', url: 'https://www.toto.com' },
        {
          subject: 'title',
        }
      )
    })

    it('should share on Instagram when instagram mode', async () => {
      await share({ content: defaultContent, mode: Network.instagram })

      expect(mockShareSingle).toHaveBeenCalledWith({
        social: Social.Instagram,
        message: encodeURIComponent('Message :\nhttps://www.toto.com'),
        type: 'text',
      })
    })

    it('should share on imessage when imessage mode', async () => {
      await share({ content: defaultContent, mode: 'iMessage' })

      expect(mockOpenUrl).toHaveBeenCalledWith('sms://&body=Message :\nhttps://www.toto.com')
    })
  })

  it('should share on Snapchat when snapchat mode', async () => {
    await share({ content: defaultContent, mode: Network.snapchat })

    expect(mockShareSingle).toHaveBeenCalledWith({
      social: Social.Snapchat,
      message: 'Message :\n',
      url: 'https://www.toto.com',
      type: 'text',
    })
  })

  it('should share on Messenger when messenger mode', async () => {
    await share({ content: defaultContent, mode: Network.messenger })

    expect(mockShareSingle).toHaveBeenCalledWith({
      social: Social.Messenger,
      message: encodeURIComponent('Message :\n'),
      type: 'text',
      url: encodeURIComponent('https://www.toto.com'),
    })
  })

  it('should log analytics when a tracker is provided', async () => {
    const logAnalytics = jest.fn()
    await share({ content: defaultContent, mode: 'default', logAnalyticsEvent: logAnalytics })

    expect(logAnalytics).toHaveBeenCalledTimes(1)
  })
})

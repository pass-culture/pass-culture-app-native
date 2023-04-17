import { Linking, Platform } from 'react-native'

import { checkInstalledApps } from 'features/offer/helpers/checkInstalledApps/checkInstalledApps'
import { Network } from 'ui/components/ShareMessagingApp'

const canOpenURLSpy = jest.spyOn(Linking, 'canOpenURL')

describe('checkInstalledApps', () => {
  describe('iOS', () => {
    beforeEach(() => (Platform.OS = 'ios'))

    it('should always consider snapchat uninstalled', async () => {
      canOpenURLSpy.mockResolvedValueOnce(true)
      const apps = await checkInstalledApps()

      expect(apps[Network.snapchat]).toBeFalsy()
    })

    it('should always consider google messages uninstalled', async () => {
      canOpenURLSpy.mockResolvedValueOnce(true)
      const apps = await checkInstalledApps()

      expect(apps[Network.googleMessages]).toBeFalsy()
    })
  })

  describe('Android', () => {
    beforeEach(() => (Platform.OS = 'android'))

    it('should always consider instagram uninstalled', async () => {
      const apps = await checkInstalledApps()

      expect(apps[Network.instagram]).toBeFalsy()
    })

    it('should always consider imessage uninstalled', async () => {
      const apps = await checkInstalledApps()

      expect(apps[Network.imessage]).toBeFalsy()
    })
  })

  it('should be false for network when it is uninstalled', async () => {
    canOpenURLSpy.mockResolvedValueOnce(false).mockResolvedValueOnce(false) // first mock for snapchat or instagram, second for messenger

    const apps = await checkInstalledApps()

    expect(apps[Network.whatsapp]).toBeFalsy()
  })

  it('should be true for network when it is installed', async () => {
    canOpenURLSpy.mockResolvedValueOnce(true).mockResolvedValueOnce(true) // first mock for snapchat or instagram, second for whatsapp

    const apps = await checkInstalledApps()

    expect(apps[Network.whatsapp]).toBeTruthy()
  })
})

/* eslint-disable local-rules/independent-mocks */
import { Linking, Platform } from 'react-native'

import { Network } from 'ui/components/ShareMessagingApp'

import { getInstalledApps, checkIsInstalled } from './getInstalledApps'

const canOpenURLSpy = jest.spyOn(Linking, 'canOpenURL')

// We do not use mockResolvedValueOnce or mockImplementationOnce in these tests because the mock is called multiple times in the function
// The mock is overriden in each test so they do not depend on each other
describe('getInstalledApps', () => {
  it('should return nothing given no networks are installed', async () => {
    canOpenURLSpy.mockResolvedValue(false)

    const result = await getInstalledApps()

    expect(result).toEqual([])
  })

  it('should get installed network', async () => {
    canOpenURLSpy.mockImplementation(async (url: string): Promise<boolean> => {
      switch (url) {
        case 'whatsapp://send/':
          return true
        default:
          return false
      }
    })

    const result = await getInstalledApps()

    expect(result).toEqual([Network.whatsapp])
  })

  it('should get installed networks', async () => {
    canOpenURLSpy.mockImplementation(async (url: string): Promise<boolean> => {
      switch (url) {
        case 'instagram://user/':
        case 'whatsapp://send/':
        case 'fb-messenger://':
          return true
        default:
          return false
      }
    })

    const result = await getInstalledApps()

    expect(result).toEqual([Network.instagram, Network.whatsapp, Network.messenger])
  })

  it('should limit to 3 networks', async () => {
    canOpenURLSpy.mockResolvedValue(true)

    const result = await getInstalledApps()

    expect(result).toEqual([Network.instagram, Network.whatsapp, Network.imessage])
  })

  describe('device specific', () => {
    describe('Android', () => {
      beforeAll(() => (Platform.OS = 'android'))

      it('should respect priority', async () => {
        canOpenURLSpy.mockResolvedValue(true)

        const result = await checkIsInstalled()

        expect(result).toEqual([
          Network.snapchat,
          Network.instagram,
          Network.whatsapp,
          Network.googleMessages,
          Network.messenger,
          Network.telegram,
          Network.viber,
        ])
      })

      it('should never consider twitter installed', async () => {
        canOpenURLSpy.mockImplementation(async (url: string): Promise<boolean> => {
          switch (url) {
            case 'twitter://':
              return true
            default:
              return false
          }
        })

        const result = await getInstalledApps()

        expect(result).toEqual([])
      })

      it('should consider google message as the default messaging app', async () => {
        canOpenURLSpy.mockImplementation(async (url: string): Promise<boolean> => {
          switch (url) {
            case 'sms://':
              return true
            default:
              return false
          }
        })

        const result = await getInstalledApps()

        expect(result).toEqual([Network.googleMessages])
      })
    })

    describe('iOS', () => {
      beforeAll(() => (Platform.OS = 'ios'))

      it('should respect priority', async () => {
        canOpenURLSpy.mockResolvedValue(true)

        const result = await checkIsInstalled()

        expect(result).toEqual([
          Network.instagram,
          Network.whatsapp,
          Network.imessage,
          Network.messenger,
          Network.telegram,
          Network.viber,
        ])
      })

      it('should never consider twitter installed', async () => {
        canOpenURLSpy.mockImplementation(async (url: string): Promise<boolean> => {
          switch (url) {
            case 'twitter://':
              return true
            default:
              return false
          }
        })

        const result = await getInstalledApps()

        expect(result).toEqual([])
      })

      it('should not support share on snapchat because it does not work', async () => {
        canOpenURLSpy.mockImplementation(async (url: string): Promise<boolean> => {
          switch (url) {
            case 'snapchat://':
              return true
            default:
              return false
          }
        })
        const result = await getInstalledApps()
        expect(result).toEqual([])
      })

      it('should consider iMessage as the default messaging app', async () => {
        canOpenURLSpy.mockImplementation(async (url: string): Promise<boolean> => {
          switch (url) {
            case 'sms://':
              return true
            default:
              return false
          }
        })

        const result = await getInstalledApps()

        expect(result).toEqual([Network.imessage])
      })
    })

    describe('Web', () => {
      beforeAll(() => {
        Platform.OS = 'web'

        canOpenURLSpy.mockRejectedValue('should not be called')
      })

      it('should respect priority', async () => {
        const result = await checkIsInstalled()

        expect(result).toEqual([Network.whatsapp, Network.telegram, Network.twitter])
      })
    })
  })
})

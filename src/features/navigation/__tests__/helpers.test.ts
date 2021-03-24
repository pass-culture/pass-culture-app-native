import { Linking } from 'react-native'
import waitForExpect from 'wait-for-expect'

import { DEEPLINK_DOMAIN } from 'features/deeplinks'
import { navigationRef } from 'features/navigation/navigationRef'
import { analytics } from 'libs/analytics'

import { openExternalUrl } from '../helpers'

// Jest.Mocks are located at the end of file for a better reading

describe('Navigation helpers', () => {
  afterEach(jest.clearAllMocks)

  it('should not capture links that doesnt start with the universal links domain', async () => {
    const openUrl = jest.spyOn(Linking, 'openURL').mockResolvedValueOnce(undefined)
    const link = 'https://www.google.com'
    await openExternalUrl(link)

    expect(openUrl).toBeCalled()
  })

  it('should capture links that start with the universal links domain', async () => {
    const openUrl = jest.spyOn(Linking, 'openURL').mockResolvedValueOnce(undefined)
    const link = DEEPLINK_DOMAIN + 'my-route-to-test?param1=ok'
    await openExternalUrl(link)

    expect(openUrl).not.toBeCalled()
  })

  it('should log analytics when logEvent is true', async () => {
    jest.spyOn(Linking, 'openURL').mockResolvedValueOnce(undefined)
    const link = 'https://www.google.com'

    await openExternalUrl(link)

    await waitForExpect(() => {
      expect(analytics.logOpenExternalUrl).toBeCalledWith(link)
    })
  })

  it('should not log analytics event when logEvent is false', async () => {
    jest.spyOn(Linking, 'openURL').mockResolvedValueOnce(undefined)
    const link = 'https://www.google.com'

    await openExternalUrl(link, false)

    await waitForExpect(() => {
      expect(analytics.logOpenExternalUrl).not.toBeCalled()
    })
  })

  it('should redirect universal links to the right screen', async () => {
    const link = DEEPLINK_DOMAIN + 'my-route-to-test?param1=ok'
    await openExternalUrl(link)

    expect(navigationRef.current?.navigate).toBeCalledWith('UniqueTestRoute', { param1: 'ok' })
  })
})

jest.mock('features/navigation/navigationRef')

/** FAKING DEEPLINKS ROUTING */
jest.mock('features/deeplinks/routing', () => ({
  DEEPLINK_TO_SCREEN_CONFIGURATION: {
    'my-route-to-test': function (params: Record<string, string>) {
      return {
        screen: 'UniqueTestRoute',
        params: {
          param1: params.param1,
        },
      }
    },
  },
}))
/** FAKING DEEPLINKS ROUTING END */

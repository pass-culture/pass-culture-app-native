import { Linking } from 'react-native'

import { DEEPLINK_DOMAIN } from 'features/deeplinks'
import { navigationRef } from 'features/navigation/navigationRef'

import { openExternalUrl } from '../helpers'

// Jest.Mocks are located at the end of file for a better reading

describe('Navigation helpers', () => {
  afterEach(jest.resetAllMocks)

  it('should not capture links that doesnt start with the universal links domain', async () => {
    const openUrl = jest.spyOn(Linking, 'openURL')
    const link = 'https://www.google.com'
    await openExternalUrl(link)

    expect(openUrl).toBeCalled()
  })
  it('should capture links that start with the universal links domain', async () => {
    const openUrl = jest.spyOn(Linking, 'openURL')
    const link = DEEPLINK_DOMAIN + 'my-route-to-test?param1=ok'
    await openExternalUrl(link)

    expect(openUrl).not.toBeCalled()
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

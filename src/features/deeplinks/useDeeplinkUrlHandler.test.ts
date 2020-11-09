import { navigate } from '__mocks__/@react-navigation/native'
import { env } from 'libs/environment'

import { DeepLinkToScreenMap } from './types'
import {
  decodeDeeplinkParts,
  formatAndroidDeeplinkDomain,
  formatIosDeeplinkDomain,
  useDeeplinkUrlHandler,
} from './useDeeplinkUrlHandler'

jest.mock('features/deeplinks/types', () => ({
  deeplinkRoutesToScreensMap: {
    'my-route-to-login': 'Login',
  } as DeepLinkToScreenMap,
}))

describe('useDeeplinkUrlHandler', () => {
  describe('Formatting', () => {
    it('should format properly the deeplink domain for iOS', () => {
      const deeplinkUrl = formatIosDeeplinkDomain()
      expect(deeplinkUrl).toEqual(`${env.URL_PREFIX}://${env.IOS_APP_ID}/`)
    })
    it('should format properly the deeplink domain for Android', () => {
      const deeplinkUrl = formatAndroidDeeplinkDomain()
      expect(deeplinkUrl).toEqual(`${env.URL_PREFIX}://${env.ANDROID_APP_ID}/`)
    })
  })
  describe('Url parts', () => {
    const uri = 'my-route?param1=one&param2=2&param3=true&param4=false'
    const uriWithoutParams = 'my-route/test' // slash will be included in the route name

    it.each([
      ['Android', formatAndroidDeeplinkDomain() + uri],
      ['iOS', formatIosDeeplinkDomain() + uri],
    ])('should parse route name and uri params for %s', (_platform, url) => {
      const { routeName, params } = decodeDeeplinkParts(url)
      expect(routeName).toEqual('my-route')
      expect(params).toMatchObject<Record<string, string>>({
        param1: 'one',
        param2: '2',
        param3: 'true',
        param4: 'false',
      })
    })
    it.each([
      ['Android', formatAndroidDeeplinkDomain() + uriWithoutParams],
      ['iOS', formatIosDeeplinkDomain() + uriWithoutParams],
    ])('should handle url without uri params for %s', (_platform, url) => {
      const { routeName, params } = decodeDeeplinkParts(url)
      expect(routeName).toEqual('my-route/test')
      expect(params).toEqual({})
    })
  })
  describe('Navigation handler', () => {
    it('should redirect to the right component when it exists', () => {
      const handleDeeplinkUrl = useDeeplinkUrlHandler()
      const url = formatIosDeeplinkDomain() + 'my-route-to-login?param1=one&param2=2'

      handleDeeplinkUrl({ url })

      expect(navigate).toHaveBeenCalledWith('Login', {
        param1: 'one',
        param2: '2',
      })
    })
    it('should redirect to Home when the route is not recognized', () => {
      const handleDeeplinkUrl = useDeeplinkUrlHandler()
      const url = formatIosDeeplinkDomain() + 'unknwon-route?param1=one&param2=2'

      handleDeeplinkUrl({ url })

      expect(navigate).toHaveBeenCalledWith('Home')
    })
  })
})

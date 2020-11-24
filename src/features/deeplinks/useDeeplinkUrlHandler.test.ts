import { renderHook } from '@testing-library/react-hooks'

import { navigate } from '__mocks__/@react-navigation/native'
import { RouteParams } from 'features/navigation/RootNavigator'

import { DeepLinksToScreenConfiguration } from './types'
import { decodeDeeplinkParts, useDeeplinkUrlHandler } from './useDeeplinkUrlHandler'
import { DEEPLINK_DOMAIN } from './utils'

describe('useDeeplinkUrlHandler', () => {
  describe('Url parts', () => {
    const uri = 'my-route?param1=one&param2=2&param3=true&param4=false'
    const uriWithoutParams = 'my-route/test' // slash will be included in the route name

    it.each([
      ['Android', DEEPLINK_DOMAIN + uri],
      ['iOS', DEEPLINK_DOMAIN + uri],
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
      ['Android', DEEPLINK_DOMAIN + uriWithoutParams],
      ['iOS', DEEPLINK_DOMAIN + uriWithoutParams],
    ])('should handle url without uri params for %s', (_platform, url) => {
      const { routeName, params } = decodeDeeplinkParts(url)
      expect(routeName).toEqual('my-route/test')
      expect(params).toEqual({})
    })
  })
  describe('Navigation handler', () => {
    it('should redirect to the right component when it exists', () => {
      const {
        result: { current: handleDeeplinkUrl },
      } = renderHook(useDeeplinkUrlHandler)

      const url = DEEPLINK_DOMAIN + 'my-route-to-test?param1=one&param2=2&param3=true&param4=false'

      handleDeeplinkUrl({ url })

      expect(navigate).toHaveBeenCalledWith('UniqueTestRoute', {
        param1: 'one',
        param2: 2,
        param3: true,
        param4: false,
      })
    })
    it('should redirect to Home when the route is not recognized', () => {
      const {
        result: { current: handleDeeplinkUrl },
      } = renderHook(useDeeplinkUrlHandler)
      const url = DEEPLINK_DOMAIN + 'unknwon-route?param1=one&param2=2'

      handleDeeplinkUrl({ url })

      expect(navigate).toHaveBeenCalledWith('Home')
    })
  })
})

/** FAKING NAVIGATION BY REDEFINING A LOCAL STACK PARAMLIST */
type DeepLinksToScreenMapForTest = { 'my-route-to-test': 'UniqueTestRoute'; default: 'Home' }

type RootStackParamListForTest = {
  UniqueTestRoute: { param1: string; param2: number; param3: boolean; param4: boolean }
}

jest.mock('features/deeplinks/types', () => ({
  DEEPLINK_TO_SCREEN_CONFIGURATION: {
    'my-route-to-test': {
      screen: 'UniqueTestRoute',
      paramConverter({
        param1,
        param2,
        param3,
        param4,
      }: Record<string, string>): RouteParams<RootStackParamListForTest, 'UniqueTestRoute'> {
        return {
          param1,
          param2: Number(param2),
          param3: param3 === 'true',
          param4: param4 === 'true',
        }
      },
    },
    default: {
      screen: 'Home',
    },
  } as DeepLinksToScreenConfiguration<DeepLinksToScreenMapForTest, RootStackParamListForTest>,
}))

/** FAKING NAVIGATION END */

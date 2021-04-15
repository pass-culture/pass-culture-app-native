import { env } from 'libs/environment'

import { parseURI } from './useDeeplinkUrlHandler'
import {
  DEEPLINK_DOMAIN,
  FIREBASE_DYNAMIC_LINK_DOMAIN,
  getLongDynamicLinkURI,
  generateLongFirebaseDynamicLink,
} from './utils'

describe('Formatting deeplink url', () => {
  afterAll(() => jest.resetAllMocks())

  it('should format properly the universal link', () => {
    expect(DEEPLINK_DOMAIN).toEqual(`https://${env.UNIVERSAL_LINK}/`)
  })

  describe('getLongDynamicLinkURI', () => {
    it.each([
      [false, 0],
      [true, 1],
    ])(
      'should create the right URI for Firebase Dynamic Links',
      (ignoreMiddlePage, expectedIgnoreMiddlePage) => {
        const parsed = parseURI(getLongDynamicLinkURI(ignoreMiddlePage))

        expect(parsed).toEqual({
          apn: env.ANDROID_APP_ID,
          isi: String(env.IOS_APP_STORE_ID),
          ibi: env.IOS_APP_ID,
          efr: String(expectedIgnoreMiddlePage),
        })
      }
    )
  })

  describe('generateLongFirebaseDynamicLink', () => {
    it('should return a format long firebase dynamic link', () => {
      const screen = 'offer'
      const uri = 'id=345&test_params=est_ce_que_cest_ok'
      const url = generateLongFirebaseDynamicLink(screen, uri)

      expect(url).toEqual(
        `${FIREBASE_DYNAMIC_LINK_DOMAIN}?link=${DEEPLINK_DOMAIN}${screen}?${uri}&${getLongDynamicLinkURI()}`
      )
    })
  })
})

import { env } from 'libs/environment'

import { parseURI } from './useDeeplinkUrlHandler'
import {
  WEBAPP_NATIVE_REDIRECTION_URL,
  FIREBASE_DYNAMIC_LINK_URL,
  getLongDynamicLinkURI,
  generateLongFirebaseDynamicLink,
  isFirebaseDynamicLink,
  isFirebaseLongDynamicLink,
  extractUniversalLinkFromLongFirebaseDynamicLink,
  resolveHandler,
} from './utils'

describe('Formatting deeplink url', () => {
  afterAll(() => jest.resetAllMocks())

  it('should format properly the universal link', () => {
    expect(WEBAPP_NATIVE_REDIRECTION_URL).toEqual(`https://${env.WEBAPP_NATIVE_REDIRECTION_DOMAIN}`)
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
      const webAppUrl = 'https://web.example.com'
      const uri = '345&test_params=est_ce_que_cest_ok'
      const url = generateLongFirebaseDynamicLink(screen, webAppUrl, uri)
      expect(url).toEqual(
        `${FIREBASE_DYNAMIC_LINK_URL}/?link=${webAppUrl}/${screen}/${uri}&${getLongDynamicLinkURI()}`
      )
    })
  })

  describe('isFirebaseDynamicLink', () => {
    it('should return true when the link starts like a firebase dynamic link', () => {
      const isDynamicLink = isFirebaseDynamicLink(FIREBASE_DYNAMIC_LINK_URL + '/home')
      expect(isDynamicLink).toBe(true)
    })
    it('should return false when the link doesnt start like a firebase dynamic link', () => {
      const isDynamicLink = isFirebaseDynamicLink('https://www.not-google.fr/home')
      expect(isDynamicLink).toBe(false)
    })
  })

  describe('isFirebaseLongDynamicLink', () => {
    it('should return true when the given firebase link has a "link" uri param', () => {
      const isLongDynamicLink = isFirebaseLongDynamicLink(
        FIREBASE_DYNAMIC_LINK_URL + '/?link=https://a.link'
      )
      expect(isLongDynamicLink).toBe(true)
    })
    it('should return false when the given firebase link has not a "link" uri param', () => {
      const isLongDynamicLink = isFirebaseLongDynamicLink(
        FIREBASE_DYNAMIC_LINK_URL + '/?not-link=https://a.link'
      )
      expect(isLongDynamicLink).toBe(false)
    })
    it('should return false when the given link is not a firebase dynamic link', () => {
      const isLongDynamicLink = isFirebaseLongDynamicLink('https://www.not-google.fr/home')
      expect(isLongDynamicLink).toBe(false)
    })
  })

  describe('extractUniversalLinkFromLongFirebaseDynamicLink', () => {
    it('should convert long dynamic link to the injected universal link', () => {
      const url = FIREBASE_DYNAMIC_LINK_URL + '/?link=https://a.link'
      const extracted = extractUniversalLinkFromLongFirebaseDynamicLink({ url })
      expect(extracted).toBe('https://a.link')
    })
  })

  describe('handleLinks', () => {
    it('should forward deeplink event for universal link', () => {
      const url = WEBAPP_NATIVE_REDIRECTION_URL + '/home'
      const deeplinkEvent = { url }
      const handleDeeplinkUrl = jest.fn()

      const handler = resolveHandler(handleDeeplinkUrl)
      handler(deeplinkEvent)

      expect(handleDeeplinkUrl).toBeCalledWith(deeplinkEvent)
    })
    it('should extract universal link for firebase long dynamic link', () => {
      const url = FIREBASE_DYNAMIC_LINK_URL + '/?link=https://a.link'
      const handleDeeplinkUrl = jest.fn()

      const handler = resolveHandler(handleDeeplinkUrl)
      handler({ url })

      expect(handleDeeplinkUrl).toBeCalledWith({ url: 'https://a.link' })
    })
    it.each([undefined, false])(
      'should do anything for firebase short dynamic link (listenShortLinks=%s)',
      (listenShortLinks) => {
        const url = FIREBASE_DYNAMIC_LINK_URL + '/home'
        const handleDeeplinkUrl = jest.fn()

        const handler = resolveHandler(handleDeeplinkUrl, listenShortLinks)
        handler({ url })

        expect(handleDeeplinkUrl).not.toBeCalled()
      }
    )
    it('should handle firebase short dynamic link when listenShortLinks=true', () => {
      const url = FIREBASE_DYNAMIC_LINK_URL + '/home'
      const handleDeeplinkUrl = jest.fn()
      const listenShortLinks = true

      const handler = resolveHandler(handleDeeplinkUrl, listenShortLinks)
      handler({ url })

      expect(handleDeeplinkUrl).toBeCalledWith({ url: '/home' })
    })
  })
})

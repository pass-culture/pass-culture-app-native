import { env } from 'libs/environment'

import {
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

  describe('getLongDynamicLinkURI', () => {
    it('should create the right URI for Firebase Dynamic Links', () => {
      const params = new URLSearchParams(getLongDynamicLinkURI())
      expect(params.get('apn')).toEqual(env.ANDROID_APP_ID)
      expect(params.get('isi')).toEqual(String(env.IOS_APP_STORE_ID))
      expect(params.get('ibi')).toEqual(env.IOS_APP_ID)
    })
  })

  describe('generateLongFirebaseDynamicLink', () => {
    it('should return a format long firebase dynamic link', () => {
      const fullWebAppUrlWithParams = 'https://web.example.com/offre/1'
      const encodedFullWebAppUrlWithParams = 'https%3A%2F%2Fweb.example.com%2Foffre%2F1'
      const dynamicLink = generateLongFirebaseDynamicLink(fullWebAppUrlWithParams)
      expect(dynamicLink).toEqual(
        `${FIREBASE_DYNAMIC_LINK_URL}/?link=${encodedFullWebAppUrlWithParams}&${getLongDynamicLinkURI()}`
      )
    })
  })

  describe('generateLongFirebaseDynamicLink with extra FDL params', () => {
    it('should return a format long firebase dynamic link', () => {
      const fullWebAppUrlWithParams = 'https://web.example.com/set-email'
      const encodedFullWebAppUrlWithParams = 'https%3A%2F%2Fweb.example.com%2Fset-email'
      const ofl = `https://${env.WEBAPP_V2_DOMAIN}/set-email`
      const amv = '10160005'
      const extraParams = {
        ofl,
        amv,
      }
      const dynamicLink = generateLongFirebaseDynamicLink(fullWebAppUrlWithParams, extraParams)
      expect(dynamicLink).toEqual(
        `${FIREBASE_DYNAMIC_LINK_URL}/?link=${encodedFullWebAppUrlWithParams}&${getLongDynamicLinkURI()}&ofl=https://webapp-v2.example.com/set-email&amv=10160005`
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

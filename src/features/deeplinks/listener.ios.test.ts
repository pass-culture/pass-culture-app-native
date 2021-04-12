import { env } from 'libs/environment'

import {
  isFirebaseDynamicLink,
  isFirebaseLongDynamicLink,
  extractUniversalLinkFromLongFirebaseDynamicLink,
  resolveHandler,
} from './listener.ios'
import { FIREBASE_DYNAMIC_LINK_DOMAIN } from './utils'

describe('listener.ios', () => {
  describe('isFirebaseDynamicLink', () => {
    it('should return true when the link starts like a firebase dynamic link', () => {
      const isDynamicLink = isFirebaseDynamicLink(FIREBASE_DYNAMIC_LINK_DOMAIN + '/home')
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
        FIREBASE_DYNAMIC_LINK_DOMAIN + '?link=https://a.link'
      )
      expect(isLongDynamicLink).toBe(true)
    })
    it('should return false when the given firebase link has not a "link" uri param', () => {
      const isLongDynamicLink = isFirebaseLongDynamicLink(
        FIREBASE_DYNAMIC_LINK_DOMAIN + '?not-link=https://a.link'
      )
      expect(isLongDynamicLink).toBe(false)
    })
    it('should return undefined when the given link is not a firebase dynamic link', () => {
      const isLongDynamicLink = isFirebaseLongDynamicLink('https://www.not-google.fr/home')
      expect(isLongDynamicLink).toBe(undefined)
    })
  })
  describe('convertLongDynamicLinkToUniversalLink', () => {
    it('should convert long dynamic link to the injected universal link', () => {
      const url = FIREBASE_DYNAMIC_LINK_DOMAIN + '?link=https://a.link'
      const extracted = extractUniversalLinkFromLongFirebaseDynamicLink({ url })
      expect(extracted).toBe('https://a.link')
    })
  })
  describe('handleLinks', () => {
    it('should forward deeplink event for universal link', () => {
      const url = env.UNIVERSAL_LINK + '/home'
      const deeplinkEvent = { url }
      const handleDeeplinkUrl = jest.fn()

      const handler = resolveHandler(handleDeeplinkUrl)
      handler(deeplinkEvent)

      expect(handleDeeplinkUrl).toBeCalledWith(deeplinkEvent)
    })
    it('should extract universal link for firebase long dynamic link', () => {
      const url = FIREBASE_DYNAMIC_LINK_DOMAIN + '?link=https://a.link'
      const handleDeeplinkUrl = jest.fn()

      const handler = resolveHandler(handleDeeplinkUrl)
      handler({ url })

      expect(handleDeeplinkUrl).toBeCalledWith({ url: 'https://a.link' })
    })
    it('should do anything for firebase short dynamic link', () => {
      const url = FIREBASE_DYNAMIC_LINK_DOMAIN + '/home'
      const handleDeeplinkUrl = jest.fn()

      const handler = resolveHandler(handleDeeplinkUrl)
      handler({ url })

      expect(handleDeeplinkUrl).not.toBeCalled()
    })
  })
})

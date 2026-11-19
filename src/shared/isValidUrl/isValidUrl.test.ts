import { env } from 'libs/environment/env'
import * as isValidUrl from 'shared/isValidUrl/isValidUrl'

describe('isValidHttpsUrl', () => {
  it('should return true for a valid HTTPS URL', () => {
    const url = 'https://passkultur.app/fin?status=aborted&return_reason=verify_later'

    expect(isValidUrl.isValidHttpsUrl(url)).toBe(true)
  })

  it('should return false for a valid HTTP URL', () => {
    const url = 'http://passkultur.app/path/fin?status=aborted&return_reason=verify_later'

    expect(isValidUrl.isValidHttpsUrl(url)).toBe(false)
  })

  it('should return false for an invalid URL', () => {
    expect(isValidUrl.isValidHttpsUrl('javascript:alert("hello")')).toBe(false)
  })

  it('should return false for malformed or arbitrary string inputs', () => {
    expect(isValidUrl.isValidHttpsUrl('not_a_url')).toBe(false)
    expect(isValidUrl.isValidHttpsUrl('https://')).toBe(false)
    expect(isValidUrl.isValidHttpsUrl('://invalid-url')).toBe(false)
    expect(isValidUrl.isValidHttpsUrl('')).toBe(false)
  })

  describe('hostname validation', () => {
    it('should return true when hostname matches', () => {
      const url = 'https://passkultur.app/fin?status=aborted&return_reason=verify_later'

      expect(isValidUrl.isValidHttpsUrl(url, 'passkultur.app')).toBe(true)
    })

    it('should return false when hostname does not match', () => {
      const url = 'https://passkultur.app/fin?status=aborted&return_reason=verify_later'

      expect(isValidUrl.isValidHttpsUrl(url, 'passkoultour.app')).toBe(false)
    })
  })
})

describe('isValidUbbleUrl', () => {
  it('should validate the Ubble hostname', () => {
    const isValidHttpsUrlSpy = jest.spyOn(isValidUrl, 'isValidHttpsUrl')
    const url = 'https://id.ubble.ai/fin?status=aborted&return_reason=verify_later'

    expect(isValidUrl.isValidUbbleUrl(url)).toBe(true)
    expect(isValidHttpsUrlSpy).toHaveBeenCalledWith(url, 'id.ubble.ai')

    isValidHttpsUrlSpy.mockRestore()
  })
})

describe('isValidEduConnectUrl', () => {
  it('should validate the EduConnect hostname', () => {
    const isValidHttpsUrlSpy = jest.spyOn(isValidUrl, 'isValidHttpsUrl')
    const hostname = new URL(env.EDUCONNECT_ALLOWED_DOMAIN).hostname
    const url = `https://${hostname}/logout`

    expect(isValidUrl.isValidEduConnectUrl(url)).toBe(true)
    expect(isValidHttpsUrlSpy).toHaveBeenCalledWith(url, hostname)

    isValidHttpsUrlSpy.mockRestore()
  })

  it.each([
    `https://${new URL(env.EDUCONNECT_ALLOWED_DOMAIN).hostname}@google.com/phish`,
    `https://${new URL(env.EDUCONNECT_ALLOWED_DOMAIN).hostname}.google.com/phish`,
    'https://google.com/phish',
    `http://${new URL(env.EDUCONNECT_ALLOWED_DOMAIN).hostname}/logout`,
    'not_a_url',
  ])('should return false for an invalid EduConnect URL: %s', (url) => {
    expect(isValidUrl.isValidEduConnectUrl(url)).toBe(false)
  })
})

describe('isValidWikipediaUrl', () => {
  it('should validate the French Wikipedia hostname', () => {
    const isValidHttpsUrlSpy = jest.spyOn(isValidUrl, 'isValidHttpsUrl')
    const url = 'https://fr.wikipedia.org/wiki/Victor_Hugo'

    expect(isValidUrl.isValidWikipediaUrl(url)).toBe(true)
    expect(isValidHttpsUrlSpy).toHaveBeenCalledWith(url, 'fr.wikipedia.org')

    isValidHttpsUrlSpy.mockRestore()
  })

  it('should return false for undefined or null', () => {
    expect(isValidUrl.isValidWikipediaUrl(undefined)).toBe(false)
    expect(isValidUrl.isValidWikipediaUrl(null)).toBe(false)
  })
})

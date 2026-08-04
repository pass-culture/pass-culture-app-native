import * as isValidUrl from 'shared/isValidUrl/isValidUrl'

describe('isValidHttpsUrl', () => {
  it('should be true when url is valid, and https', () => {
    const url = 'https://passkultur.app/fin?status=aborted&return_reason=verify_later'
    const isValid = isValidUrl.isValidHttpsUrl(url)

    expect(isValid).toBe(true)
  })

  it('should be false when url is valid but http', () => {
    const url = 'http://passkultur.app/path/fin?status=aborted&return_reason=verify_later'
    const isValid = isValidUrl.isValidHttpsUrl(url)

    expect(isValid).toBe(false)
  })

  it('should be false when url is not valid', () => {
    const url = 'javascript:alert("hello")'
    const isValid = isValidUrl.isValidHttpsUrl(url)

    expect(isValid).toBe(false)
  })

  it('should be true when url is valid and hostname is the one expected', () => {
    const url = 'https://passkultur.app/fin?status=aborted&return_reason=verify_later'
    const isValid = isValidUrl.isValidHttpsUrl(url, 'passkultur.app')

    expect(isValid).toBe(true)
  })

  it('should be false when url is valid and hostname is not the one expected', () => {
    const url = 'https://passkultur.app/fin?status=aborted&return_reason=verify_later'
    const isValid = isValidUrl.isValidHttpsUrl(url, 'passkoultour.app')

    expect(isValid).toBe(false)
  })

  it('should return false for malformed or arbitrary string inputs', () => {
    expect(isValidUrl.isValidHttpsUrl('not_a_url')).toBe(false)
    expect(isValidUrl.isValidHttpsUrl('https://')).toBe(false)
    expect(isValidUrl.isValidHttpsUrl('://invalid-url')).toBe(false)
  })

  it('should return false for an empty string', () => {
    expect(isValidUrl.isValidHttpsUrl('')).toBe(false)
  })
})

describe('isValidUbbleUrl', () => {
  it('should be true when url is valid ubble', () => {
    const isValidHttpsUrlSpy = jest.spyOn(isValidUrl, 'isValidHttpsUrl')

    const url = 'https://id.ubble.ai/fin?status=aborted&return_reason=verify_later'
    const isValid = isValidUrl.isValidUbbleUrl(url)

    expect(isValidHttpsUrlSpy).toHaveBeenCalledWith(url, 'id.ubble.ai')
    expect(isValid).toBe(true)
  })
})

describe('isValidWikipediaUrl', () => {
  it('should return true for a standard french Wikipedia url', () => {
    const isValidHttpsUrlSpy = jest.spyOn(isValidUrl, 'isValidHttpsUrl')

    const url = 'https://fr.wikipedia.org/wiki/Victor_Hugo'
    const isValid = isValidUrl.isValidWikipediaUrl(url)

    expect(isValidHttpsUrlSpy).toHaveBeenCalledWith(url, 'fr.wikipedia.org')
    expect(isValid).toBe(true)
  })

  it('should return false for undefined or null', () => {
    expect(isValidUrl.isValidWikipediaUrl(undefined)).toBe(false)
    expect(isValidUrl.isValidWikipediaUrl(null)).toBe(false)
  })
})

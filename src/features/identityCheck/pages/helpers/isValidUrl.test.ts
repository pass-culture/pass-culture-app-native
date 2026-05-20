import * as isValidUrl from 'features/identityCheck/pages/helpers/isValidUrl'

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

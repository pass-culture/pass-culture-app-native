import { isValidUbbleUrl } from 'features/identityCheck/pages/helpers/isValidUrl'

describe('isValidUbbleUrl', () => {
  it('should be true when url is valid, ubble, and https', () => {
    const url = 'https://id.ubble.ia/fin?status=aborted&return_reason=verify_later'
    const isValidUrl = isValidUbbleUrl(url)

    expect(isValidUrl).toBe(true)
  })

  it('should be false when url is valid and https but not from ubble', () => {
    const url = 'https://domain/path/fin?status=aborted&return_reason=verify_later'
    const isValidUrl = isValidUbbleUrl(url)

    expect(isValidUrl).toBe(false)
  })

  it('should be false when url is valid ubble but http', () => {
    const url = 'http://id.ubble.ia/path/fin?status=aborted&return_reason=verify_later'
    const isValidUrl = isValidUbbleUrl(url)

    expect(isValidUrl).toBe(false)
  })

  it('should be false if url is not valid', () => {
    const url = 'javascript:alert("hello")'
    const isValidUrl = isValidUbbleUrl(url)

    expect(isValidUrl).toBe(false)
  })
})

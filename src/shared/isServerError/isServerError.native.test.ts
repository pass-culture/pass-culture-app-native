import { ApiError } from 'api/ApiError'

import { isServerError } from './isServerError'

describe('isServerError', () => {
  it.each([500, 501, 502, 503, 504, 599])('should return true for status code %i', (statusCode) => {
    expect(isServerError(new ApiError(statusCode, 'error'))).toBe(true)
  })

  it.each([100, 200, 300, 400, 404, 499, 600])(
    'should return false for status code %i',
    (statusCode) => {
      expect(isServerError(new ApiError(statusCode, 'error'))).toBe(false)
    }
  )

  it('should return false for a standard Error', () => {
    expect(isServerError(new Error('error'))).toBe(false)
  })

  it('should return false for null', () => {
    expect(isServerError(null)).toBe(false)
  })
})

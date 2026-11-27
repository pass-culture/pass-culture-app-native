import { isMatchingPreviewFingerprint } from 'features/preview/helpers/isMatchingPreviewFingerprint'

describe('isMatchingPreviewFingerprint', () => {
  it('should return true when hashes are equal', () => {
    expect(isMatchingPreviewFingerprint('abc', 'abc')).toBe(true)
  })

  it('should return false when hashes differ', () => {
    expect(isMatchingPreviewFingerprint('abc', 'def')).toBe(false)
  })

  it('should return false when device fingerprint is null', () => {
    expect(isMatchingPreviewFingerprint(null, 'abc')).toBe(false)
  })
})

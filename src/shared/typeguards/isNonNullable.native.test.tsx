import { isNonNullable } from 'shared/typeguards/isNonNullable'

describe('isNonNullable', () => {
  it('should return true for a string', () => {
    expect(isNonNullable('hello')).toBe(true)
  })

  it('should return true for an empty object', () => {
    expect(isNonNullable({})).toBe(true)
  })

  it('should return false for null', () => {
    expect(isNonNullable(null)).toBe(false)
  })

  it('should return false for undefined', () => {
    expect(isNonNullable(undefined)).toBe(false)
  })
})

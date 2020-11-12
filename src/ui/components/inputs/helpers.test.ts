import { isValueEmpty } from './helpers'

describe('isValueEmpty()', () => {
  it('should return true if value is undefined', () => {
    expect(isValueEmpty(undefined)).toBe(true)
  })

  it('should return true if value is empty string', () => {
    expect(isValueEmpty('')).toBe(true)
  })

  it('should return false if value is a non-empty string', () => {
    expect(isValueEmpty('value')).toBe(false)
  })
})

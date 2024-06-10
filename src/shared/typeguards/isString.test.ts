import { isString } from 'shared/typeguards/isString'

describe('isString', () => {
  it('should return true for a string', () => {
    expect(isString('hello')).toEqual(true)
  })

  it('should return false for null', () => {
    expect(isString(null)).toEqual(false)
  })

  it('should return false for undefined', () => {
    expect(isString(undefined)).toEqual(false)
  })
})

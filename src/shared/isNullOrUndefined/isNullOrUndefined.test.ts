import { isNullOrUndefined } from 'shared/isNullOrUndefined/isNullOrUndefined'

describe('isNullOrUndefined', () => {
  it('should return true when value is null', () => {
    const value = isNullOrUndefined(null)

    expect(value).toBeTruthy()
  })

  it('should return true when value is undefined', () => {
    const value = isNullOrUndefined(undefined)

    expect(value).toBeTruthy()
  })

  it('should return false when value is false', () => {
    const value = isNullOrUndefined(false)

    expect(value).toBeFalsy()
  })

  it('should return false when value is true', () => {
    const value = isNullOrUndefined(true)

    expect(value).toBeFalsy()
  })

  it('should return false when value is a string', () => {
    const value = isNullOrUndefined('hello')

    expect(value).toBeFalsy()
  })
})
